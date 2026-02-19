// AnythingLLM streaming chat client for local Ollama-backed AI
import {
  getAnythingLLMConfig,
  saveAnythingLLMConfig,
  isAnythingLLMConfigured,
  type AnythingLLMConfig,
} from "./config";

// Re-export config functions for backwards compatibility
export type AIConfig = AnythingLLMConfig;
export const getAIConfig = getAnythingLLMConfig;
export const saveAIConfig = saveAnythingLLMConfig;
export const isAIConfigured = isAnythingLLMConfigured;

export function buildSystemPrompt(pathname: string, config: AIConfig): string {
  let context = "the dashboard";
  if (pathname.includes("client-discovery")) context = "the client discovery workflow";
  else if (pathname.includes("presentation")) context = "presentation mode";
  else if (pathname.includes("active-cases")) context = "the active cases list";
  else if (pathname.includes("case-detail")) context = "a case detail view";
  else if (pathname.includes("handoff")) context = "the handoff package";
  else if (pathname.includes("training")) context = "the training center";
  else if (pathname.includes("settings")) context = "the settings page";

  const styleMap: Record<string, string> = {
    concise: "Keep responses brief and to the point — 2-3 sentences when possible.",
    detailed: "Provide thorough, detailed explanations with examples.",
    "step-by-step": "Break responses into numbered steps for easy following.",
  };

  return [
    "You are FinBox AI, an expert assistant for Canadian insurance advisors in British Columbia.",
    "Your PRIMARY FOCUS is Immediate Financing Arrangements (IFAs) — corporate-owned life insurance strategies used for tax-efficient wealth accumulation, estate planning, and balance sheet strengthening in Canadian corporations.",
    "You also provide expertise on participating whole life insurance, universal life insurance, term life insurance, and segregated funds from Canadian carriers including Manulife and Equitable Life Canada.",
    "You understand Canadian tax concepts critical to IFAs and corporate insurance: CDA (Capital Dividend Account), NCPI (Net Cost of Pure Insurance), ACB (Adjusted Cost Basis), corporate taxation under the Income Tax Act (ITA), and how permanent life insurance integrates with corporate tax planning.",
    `The advisor is currently viewing ${context}.`,
    styleMap[config.responseStyle] || styleMap.concise,
    config.citations ? "When relevant, include compliance citations and regulatory references (BCFSA, CLHIA, CCIR, provincial regulations, relevant ITA sections)." : "",
    "Never provide specific legal or tax advice — always recommend consulting a qualified Canadian tax professional or legal advisor, especially for complex IFA structures.",
  ].filter(Boolean).join(" ");
}

export interface StreamChatOptions {
  message: string;
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
  signal?: AbortSignal;
  pathname?: string;
}

export async function streamChat(options: StreamChatOptions): Promise<void> {
  const config = getAIConfig();
  const { message, onDelta, onDone, onError, signal, pathname = "/" } = options;

  if (!config.apiKey) {
    onError("API key not configured. Go to Settings → AI Assistant to set up AnythingLLM.");
    return;
  }

  const url = `${config.baseUrl}/api/v1/workspace/${config.workspace}/stream-chat`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        mode: "chat",
        systemPrompt: buildSystemPrompt(pathname, config),
      }),
      signal,
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        onError("Invalid API key. Check Settings → AI Assistant.");
        return;
      }
      onError(`AnythingLLM returned ${response.status}. Check that the server is running.`);
      return;
    }

    if (!response.body) {
      onError("No response stream received.");
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // AnythingLLM streams SSE: each line is "data: {...}" or "[DONE]"
      let newlineIdx: number;
      while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, newlineIdx).trim();
        buffer = buffer.slice(newlineIdx + 1);

        if (!line) continue;

        try {
          // AnythingLLM streams SSE format: "data: {...}" lines
          const raw = line.startsWith("data: ") ? line.slice(6) : line;
          if (raw === "[DONE]") break;
          const parsed = JSON.parse(raw);

          // AnythingLLM format: { textResponse: "chunk", close: false }
          if (parsed.close) {
            break;
          }
          if (parsed.textResponse) {
            onDelta(parsed.textResponse);
          }
        } catch {
          // Partial JSON or non-data SSE lines (comments, etc.), skip
        }
      }
    }

    // Flush remaining buffer
    if (buffer.trim()) {
      try {
        const raw = buffer.trim().startsWith("data: ") ? buffer.trim().slice(6) : buffer.trim();
        if (raw && raw !== "[DONE]") {
          const parsed = JSON.parse(raw);
          if (parsed.textResponse && !parsed.close) {
            onDelta(parsed.textResponse);
          }
        }
      } catch {
        // ignore
      }
    }

    onDone();
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === "AbortError") {
      onDone(); // Gracefully end on cancel
      return;
    }
    const config = getAIConfig();
    onError(`AnythingLLM is not reachable. Make sure it's running on ${config.baseUrl}`);
  }
}

export async function testConnection(): Promise<{ ok: boolean; message: string }> {
  const config = getAIConfig();
  if (!config.apiKey) {
    return { ok: false, message: "No API key configured." };
  }

  try {
    const response = await fetch(`${config.baseUrl}/api/v1/auth`, {
      headers: { Authorization: `Bearer ${config.apiKey}` },
    });

    if (response.ok) {
      return { ok: true, message: "Connected to AnythingLLM successfully." };
    }
    if (response.status === 401 || response.status === 403) {
      return { ok: false, message: "Invalid API key." };
    }
    return { ok: false, message: `Server returned ${response.status}.` };
  } catch {
    return { ok: false, message: `Cannot reach ${config.baseUrl}. Is AnythingLLM running?` };
  }
}

/**
 * Non-streaming chat query for simple one-shot questions
 * Returns the complete response as a string
 */
export async function queryChat(options: {
  message: string;
  pathname?: string;
  signal?: AbortSignal;
}): Promise<{ success: true; response: string } | { success: false; error: string }> {
  const config = getAIConfig();
  const { message, pathname = "/", signal } = options;

  if (!config.apiKey) {
    return { success: false, error: "API key not configured. Go to Settings → AI Assistant to set up AnythingLLM." };
  }

  const url = `${config.baseUrl}/api/v1/workspace/${config.workspace}/chat`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        mode: "chat",
        systemPrompt: buildSystemPrompt(pathname, config),
      }),
      signal,
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return { success: false, error: "Invalid API key. Check Settings → AI Assistant." };
      }
      return { success: false, error: `AnythingLLM returned ${response.status}. Check that the server is running.` };
    }

    const data = await response.json();

    if (data.textResponse) {
      return { success: true, response: data.textResponse };
    }

    return { success: false, error: "No response received from AnythingLLM." };
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return { success: false, error: "Request cancelled." };
    }
    return { success: false, error: `AnythingLLM is not reachable. Make sure it's running on ${config.baseUrl}` };
  }
}
