import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Upload,
  FileText,
  Trash2,
  Lock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Loader2,
  FolderOpen,
  StickyNote,
} from "lucide-react";
import { toast } from "sonner";
import { getAdvisorProfile, getAdvisorWorkspaceSlug } from "@/lib/advisor";
import { getCoreWorkspaceSlug } from "@/lib/config";
import {
  anythingLLM,
  type WorkspaceDocument,
  type UploadProgress,
  getDocumentMetadata,
  saveDocumentMetadata,
  deleteDocumentMetadata,
} from "@/services/anythingllm";

export default function DocumentManager() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [personalDocs, setPersonalDocs] = useState<WorkspaceDocument[]>([]);
  const [coreDocs, setCoreDocs] = useState<WorkspaceDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; doc?: WorkspaceDocument }>({
    open: false,
  });
  const [editingNote, setEditingNote] = useState<{ docId: string; note: string } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const advisor = getAdvisorProfile();
  const advisorSlug = getAdvisorWorkspaceSlug();
  const coreSlug = getCoreWorkspaceSlug();

  // Load documents on mount
  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    setIsLoading(true);
    try {
      // Load personal documents
      const personal = await anythingLLM.listDocuments(advisorSlug);
      const personalWithMetadata = personal.map(doc => ({
        ...doc,
        metadata: getDocumentMetadata(doc.id) || undefined,
      }));
      setPersonalDocs(personalWithMetadata);

      // Load core documents
      const core = await anythingLLM.listDocuments(coreSlug);
      const coreWithMetadata = core.map(doc => ({
        ...doc,
        metadata: { ...getDocumentMetadata(doc.id), isCore: true },
      }));
      setCoreDocs(coreWithMetadata);
    } catch (error) {
      console.error("Failed to load documents:", error);
      toast.error("Failed to load documents. Check AnythingLLM connection.");
    } finally {
      setIsLoading(false);
    }
  }

  // Handle file selection
  function handleFileSelect(files: FileList | null) {
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate PDF
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are supported");
      return;
    }

    uploadDocument(file);
  }

  // Upload document
  async function uploadDocument(file: File) {
    setIsUploading(true);
    setUploadProgress({
      fileName: file.name,
      progress: 0,
      status: "uploading",
    });

    try {
      const metadata = {
        uploadedBy: advisor.fullName,
        isCore: false,
      };

      const doc = await anythingLLM.uploadDocument(
        file,
        advisorSlug,
        metadata,
        (progress) => setUploadProgress(progress)
      );

      // Save metadata locally
      saveDocumentMetadata(doc.id, metadata);

      toast.success(`${file.name} uploaded successfully`);

      // Reload documents
      await loadDocuments();
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(`Failed to upload ${file.name}`);
      setUploadProgress({
        fileName: file.name,
        progress: 0,
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(null), 3000);
    }
  }

  // Drag and drop handlers
  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  }

  // Delete document
  async function handleDelete(doc: WorkspaceDocument) {
    try {
      await anythingLLM.deleteDocument(advisorSlug, doc.location);
      deleteDocumentMetadata(doc.id);
      toast.success(`${doc.name} deleted`);
      await loadDocuments();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete document");
    } finally {
      setDeleteDialog({ open: false });
    }
  }

  // Save note
  function saveNote(docId: string, note: string) {
    const existingMetadata = getDocumentMetadata(docId) || {};
    saveDocumentMetadata(docId, {
      ...existingMetadata,
      note,
    });
    setEditingNote(null);
    loadDocuments();
    toast.success("Note saved");
  }

  // Document card component
  function DocumentCard({ doc, isCore }: { doc: WorkspaceDocument; isCore: boolean }) {
    const isEditingThis = editingNote?.docId === doc.id;
    const currentNote = doc.metadata?.note || "";

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <FileText className="h-8 w-8 text-blue-500 shrink-0 mt-1" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{doc.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {doc.status === "indexed" && (
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Indexed
                      </Badge>
                    )}
                    {doc.status === "processing" && (
                      <Badge variant="outline" className="text-xs">
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Processing
                      </Badge>
                    )}
                    {doc.status === "failed" && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Failed
                      </Badge>
                    )}
                    {isCore && (
                      <Badge variant="secondary" className="text-xs">
                        <Lock className="h-3 w-3 mr-1" />
                        Core Training
                      </Badge>
                    )}
                  </div>
                  {doc.uploadedAt && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {!isCore && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteDialog({ open: true, doc })}
                    className="shrink-0"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>

              {/* Note section */}
              {!isCore && (
                <div className="mt-3">
                  {isEditingThis ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editingNote.note}
                        onChange={(e) =>
                          setEditingNote({ docId: doc.id, note: e.target.value })
                        }
                        placeholder="Add a note about this document..."
                        className="text-xs"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => saveNote(doc.id, editingNote.note)}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingNote(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {currentNote ? (
                        <div
                          className="text-xs text-muted-foreground bg-muted p-2 rounded cursor-pointer hover:bg-muted/80"
                          onClick={() => setEditingNote({ docId: doc.id, note: currentNote })}
                        >
                          <StickyNote className="h-3 w-3 inline mr-1" />
                          {currentNote}
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-7"
                          onClick={() => setEditingNote({ docId: doc.id, note: "" })}
                        >
                          <StickyNote className="h-3 w-3 mr-1" />
                          Add note
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Document Manager</h1>
        <p className="text-muted-foreground mt-2">
          Upload and manage your personal training documents. Core training docs are shared across
          all advisors.
        </p>
      </div>

      {/* Upload Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
          <CardDescription>
            Upload PDF training materials to your personal workspace. Only you can access your
            personal documents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm font-medium mb-2">
              Drag and drop a PDF file here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground mb-4">PDF files only</p>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <FileText className="h-4 w-4 mr-2" />
              Select PDF
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>

          {/* Upload Progress */}
          {uploadProgress && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">{uploadProgress.fileName}</p>
                <Badge
                  variant={
                    uploadProgress.status === "complete"
                      ? "default"
                      : uploadProgress.status === "error"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {uploadProgress.status}
                </Badge>
              </div>
              <Progress value={uploadProgress.progress} className="h-2" />
              {uploadProgress.error && (
                <p className="text-xs text-destructive mt-2">{uploadProgress.error}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Core Training Documents */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            <CardTitle>Core Training Documents</CardTitle>
          </div>
          <CardDescription>
            Shared training materials from Finbox-Core workspace (read-only)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : coreDocs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No core training documents found</p>
              <p className="text-xs mt-1">
                Contact your administrator to add training materials
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {coreDocs.map((doc) => (
                <DocumentCard key={doc.id} doc={doc} isCore={true} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Personal Documents */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <CardTitle>My Documents</CardTitle>
          </div>
          <CardDescription>
            Your personal training materials and notes ({advisor.fullName})
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : personalDocs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Upload className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No personal documents yet</p>
              <p className="text-xs mt-1">Upload your first document above to get started</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {personalDocs.map((doc) => (
                <DocumentCard key={doc.id} doc={doc} isCore={false} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteDialog.doc?.name}"? This action cannot be
              undone. The document will be removed from your personal workspace.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialog.doc && handleDelete(deleteDialog.doc)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
