/**
 * AnythingLLM Service Layer
 *
 * Provides typed API client for AnythingLLM operations:
 * - Workspace management (create, list, query)
 * - Document management (upload, list, delete)
 * - Multi-workspace RAG queries
 *
 * All operations run against local AnythingLLM instance at localhost:3001
 */

import { getAnythingLLMConfig, getCoreWorkspaceSlug } from "@/lib/config";

// ─── Types ──────────────────────────────────────────────────────────

export interface Workspace {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  documents?: WorkspaceDocument[];
}

export interface WorkspaceDocument {
  id: string;
  name: string;
  location: string;
  status: "indexed" | "processing" | "failed";
  uploadedAt?: string;
  metadata?: DocumentMetadata;
}

export interface DocumentMetadata {
  note?: string;  // Advisor's personal note about the document
  uploadedBy?: string;  // Advisor name
  isCore?: boolean;  // True if from Finbox-Core workspace
}

export interface QueryResponse {
  response: string;
  sources: QuerySource[];
  workspace: string;
}

export interface QuerySource {
  title: string;
  chunk: string;
  workspace: "core" | "personal";
}

export interface UploadProgress {
  fileName: string;
  progress: number;  // 0-100
  status: "uploading" | "indexing" | "complete" | "error";
  error?: string;
}

// ─── API Client ─────────────────────────────────────────────────────

class AnythingLLMService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    const config = getAnythingLLMConfig();
    this.baseUrl = config.baseUrl;
    this.apiKey = config.apiKey;
  }

  /**
   * Make authenticated request to AnythingLLM API
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`AnythingLLM API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  /**
   * Check if AnythingLLM is accessible
   */
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/auth`);
      return response.status === 200 || response.status === 401;
    } catch {
      return false;
    }
  }

  // ─── Workspace Management ────────────────────────────────────────

  /**
   * List all workspaces
   */
  async listWorkspaces(): Promise<Workspace[]> {
    const data = await this.request<{ workspaces: Workspace[] }>(
      "/api/v1/workspaces"
    );
    return data.workspaces || [];
  }

  /**
   * Get workspace by slug
   */
  async getWorkspace(slug: string): Promise<Workspace | null> {
    try {
      const data = await this.request<{ workspace: Workspace }>(
        `/api/v1/workspace/${slug}`
      );
      return data.workspace;
    } catch {
      return null;
    }
  }

  /**
   * Create new workspace
   */
  async createWorkspace(name: string, slug?: string): Promise<Workspace> {
    const data = await this.request<{ workspace: Workspace }>(
      "/api/v1/workspace/new",
      {
        method: "POST",
        body: JSON.stringify({
          name,
          slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
        }),
      }
    );
    return data.workspace;
  }

  /**
   * Get or create advisor-specific workspace
   * @param advisorName - Advisor's name (e.g., "John Smith")
   * @returns Workspace for this advisor
   */
  async getOrCreateAdvisorWorkspace(advisorName: string): Promise<Workspace> {
    const slug = `advisor-${advisorName.toLowerCase().replace(/\s+/g, "-")}`;
    const name = `Advisor-${advisorName}`;

    let workspace = await this.getWorkspace(slug);
    if (!workspace) {
      workspace = await this.createWorkspace(name, slug);
    }

    return workspace;
  }

  /**
   * Get or create core training workspace (Finbox-Core)
   */
  async getOrCreateCoreWorkspace(): Promise<Workspace> {
    const slug = getCoreWorkspaceSlug();
    const name = "Finbox-Core";

    let workspace = await this.getWorkspace(slug);
    if (!workspace) {
      workspace = await this.createWorkspace(name, slug);
    }

    return workspace;
  }

  // ─── Document Management ────────────────────────────────────────

  /**
   * List documents in a workspace
   */
  async listDocuments(workspaceSlug: string): Promise<WorkspaceDocument[]> {
    const workspace = await this.getWorkspace(workspaceSlug);
    return workspace?.documents || [];
  }

  /**
   * Upload document to workspace
   * @param file - PDF file to upload
   * @param workspaceSlug - Target workspace
   * @param metadata - Optional document metadata
   * @param onProgress - Progress callback
   */
  async uploadDocument(
    file: File,
    workspaceSlug: string,
    metadata?: DocumentMetadata,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<WorkspaceDocument> {
    // Step 1: Upload file to AnythingLLM document storage
    onProgress?.({
      fileName: file.name,
      progress: 10,
      status: "uploading",
    });

    const formData = new FormData();
    formData.append("file", file);

    const uploadResponse = await fetch(
      `${this.baseUrl}/api/v1/document/upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      const error = await uploadResponse.text();
      throw new Error(`Upload failed: ${error}`);
    }

    const uploadResult = await uploadResponse.json();

    if (!uploadResult.success) {
      throw new Error(uploadResult.error || "Upload failed");
    }

    onProgress?.({
      fileName: file.name,
      progress: 50,
      status: "indexing",
    });

    // Step 2: Add document to workspace for embedding
    const documentLocation = uploadResult.documents[0].location;

    const addResponse = await this.request<{ success: boolean; error?: string }>(
      `/api/v1/workspace/${workspaceSlug}/update-embeddings`,
      {
        method: "POST",
        body: JSON.stringify({
          adds: [documentLocation],
          deletes: [],
        }),
      }
    );

    if (!addResponse.success) {
      throw new Error(addResponse.error || "Failed to add document to workspace");
    }

    onProgress?.({
      fileName: file.name,
      progress: 100,
      status: "complete",
    });

    // Return document info
    return {
      id: documentLocation,
      name: file.name,
      location: documentLocation,
      status: "indexing",  // AnythingLLM will process in background
      uploadedAt: new Date().toISOString(),
      metadata,
    };
  }

  /**
   * Delete document from workspace
   */
  async deleteDocument(
    workspaceSlug: string,
    documentLocation: string
  ): Promise<void> {
    await this.request(`/api/v1/workspace/${workspaceSlug}/update-embeddings`, {
      method: "POST",
      body: JSON.stringify({
        adds: [],
        deletes: [documentLocation],
      }),
    });
  }

  // ─── Query & RAG ────────────────────────────────────────────────

  /**
   * Query a single workspace
   */
  async queryWorkspace(
    workspaceSlug: string,
    question: string,
    mode: "query" | "chat" = "query"
  ): Promise<QueryResponse> {
    const endpoint = mode === "chat"
      ? `/api/v1/workspace/${workspaceSlug}/chat`
      : `/api/v1/workspace/${workspaceSlug}/query`;

    const data = await this.request<{
      textResponse: string;
      sources: Array<{ title: string; chunk: string }>;
    }>(endpoint, {
      method: "POST",
      body: JSON.stringify({
        message: question,
        mode: mode === "query" ? "query" : "chat",
      }),
    });

    return {
      response: data.textResponse || "",
      sources: (data.sources || []).map(s => ({
        ...s,
        workspace: workspaceSlug === getCoreWorkspaceSlug() ? "core" : "personal",
      })),
      workspace: workspaceSlug,
    };
  }

  /**
   * Query multiple workspaces and combine results
   * @param workspaceSlugs - Array of workspace slugs to query
   * @param question - Question to ask
   * @returns Combined query response with sources labeled by workspace
   */
  async queryMultipleWorkspaces(
    workspaceSlugs: string[],
    question: string
  ): Promise<QueryResponse> {
    // Query all workspaces in parallel
    const queries = workspaceSlugs.map(slug =>
      this.queryWorkspace(slug, question).catch(error => {
        console.error(`Failed to query workspace ${slug}:`, error);
        return null;
      })
    );

    const results = await Promise.all(queries);
    const validResults = results.filter((r): r is QueryResponse => r !== null);

    if (validResults.length === 0) {
      throw new Error("All workspace queries failed");
    }

    // Combine responses - prioritize Core workspace if it has an answer
    const coreResponse = validResults.find(r => r.workspace === getCoreWorkspaceSlug());
    const primaryResponse = coreResponse || validResults[0];

    // Combine all sources
    const allSources = validResults.flatMap(r => r.sources);

    return {
      response: primaryResponse.response,
      sources: allSources,
      workspace: validResults.map(r => r.workspace).join(" + "),
    };
  }

  /**
   * Query FinBox (Core + Advisor personal workspace)
   * @param question - Question to ask
   * @param advisorName - Current advisor's name
   * @returns Combined response from both workspaces
   */
  async queryFinBox(question: string, advisorName: string): Promise<QueryResponse> {
    const coreSlug = getCoreWorkspaceSlug();
    const advisorSlug = `advisor-${advisorName.toLowerCase().replace(/\s+/g, "-")}`;

    // Ensure advisor workspace exists
    await this.getOrCreateAdvisorWorkspace(advisorName);

    // Query both workspaces
    return this.queryMultipleWorkspaces([coreSlug, advisorSlug], question);
  }
}

// ─── Singleton Instance ─────────────────────────────────────────────

export const anythingLLM = new AnythingLLMService();

// ─── Document Metadata Storage (LocalStorage) ───────────────────────

const METADATA_KEY = "finbox_document_metadata";

/**
 * Get document metadata from localStorage
 */
export function getDocumentMetadata(documentId: string): DocumentMetadata | null {
  try {
    const allMetadata = JSON.parse(localStorage.getItem(METADATA_KEY) || "{}");
    return allMetadata[documentId] || null;
  } catch {
    return null;
  }
}

/**
 * Save document metadata to localStorage
 */
export function saveDocumentMetadata(
  documentId: string,
  metadata: DocumentMetadata
): void {
  try {
    const allMetadata = JSON.parse(localStorage.getItem(METADATA_KEY) || "{}");
    allMetadata[documentId] = metadata;
    localStorage.setItem(METADATA_KEY, JSON.stringify(allMetadata));
  } catch (error) {
    console.error("Failed to save document metadata:", error);
  }
}

/**
 * Delete document metadata from localStorage
 */
export function deleteDocumentMetadata(documentId: string): void {
  try {
    const allMetadata = JSON.parse(localStorage.getItem(METADATA_KEY) || "{}");
    delete allMetadata[documentId];
    localStorage.setItem(METADATA_KEY, JSON.stringify(allMetadata));
  } catch (error) {
    console.error("Failed to delete document metadata:", error);
  }
}
