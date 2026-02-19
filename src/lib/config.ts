// AnythingLLM Configuration Management
// Reads from environment variables with localStorage fallback for deployment flexibility

export interface AnythingLLMConfig {
  baseUrl: string;
  apiKey: string;
  workspace: string;
  responseStyle: "concise" | "detailed" | "step-by-step";
  citations: boolean;
}

/**
 * Get AnythingLLM configuration from environment variables or localStorage
 * Priority: env vars > localStorage > defaults
 */
export function getAnythingLLMConfig(): AnythingLLMConfig {
  return {
    baseUrl:
      import.meta.env.VITE_ANYTHINGLLM_URL ||
      localStorage.getItem("finbox_ai_url") ||
      "http://localhost:3001",

    apiKey:
      import.meta.env.VITE_ANYTHINGLLM_API_KEY ||
      localStorage.getItem("finbox_ai_key") ||
      "",

    workspace:
      import.meta.env.VITE_ANYTHINGLLM_WORKSPACE ||
      localStorage.getItem("finbox_ai_workspace") ||
      "finbox",

    responseStyle:
      (import.meta.env.VITE_ANYTHINGLLM_RESPONSE_STYLE ||
       localStorage.getItem("finbox_ai_style") ||
       "concise") as "concise" | "detailed" | "step-by-step",

    citations:
      import.meta.env.VITE_ANYTHINGLLM_CITATIONS === "false"
        ? false
        : localStorage.getItem("finbox_ai_citations") !== "false",
  };
}

/**
 * Save AnythingLLM configuration to localStorage
 * Note: Environment variables take precedence and cannot be overridden
 */
export function saveAnythingLLMConfig(config: Partial<AnythingLLMConfig>): void {
  if (config.baseUrl !== undefined) {
    localStorage.setItem("finbox_ai_url", config.baseUrl);
  }
  if (config.apiKey !== undefined) {
    localStorage.setItem("finbox_ai_key", config.apiKey);
  }
  if (config.workspace !== undefined) {
    localStorage.setItem("finbox_ai_workspace", config.workspace);
  }
  if (config.responseStyle !== undefined) {
    localStorage.setItem("finbox_ai_style", config.responseStyle);
  }
  if (config.citations !== undefined) {
    localStorage.setItem("finbox_ai_citations", String(config.citations));
  }
}

/**
 * Check if AnythingLLM is properly configured
 */
export function isAnythingLLMConfigured(): boolean {
  const config = getAnythingLLMConfig();
  return !!config.apiKey && !!config.workspace;
}

/**
 * Get configuration source info for debugging/deployment
 */
export function getConfigSource(): {
  baseUrl: string;
  apiKey: string;
  workspace: string;
  responseStyle: string;
  citations: string;
} {
  return {
    baseUrl: import.meta.env.VITE_ANYTHINGLLM_URL ? "env" : "localStorage",
    apiKey: import.meta.env.VITE_ANYTHINGLLM_API_KEY ? "env" : "localStorage",
    workspace: import.meta.env.VITE_ANYTHINGLLM_WORKSPACE ? "env" : "localStorage",
    responseStyle: import.meta.env.VITE_ANYTHINGLLM_RESPONSE_STYLE ? "env" : "localStorage",
    citations: import.meta.env.VITE_ANYTHINGLLM_CITATIONS !== undefined ? "env" : "localStorage",
  };
}
