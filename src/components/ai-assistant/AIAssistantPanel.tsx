import { useState, useRef, useEffect, useCallback } from "react";
import { X, Minus, Send, MessageCircle, Square, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";
import { streamChat, isAIConfigured } from "@/lib/ai-client";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

function getContextualSuggestions(pathname: string): string[] {
  if (pathname === "/" || pathname === "/dashboard") {
    return ["Summarize my pending cases", "What needs attention today?", "Show compliance status"];
  }
  if (pathname.includes("client-discovery")) {
    return ["Explain 1035 exchange rules", "What qualifies as liquid assets?", "Help with suitability language"];
  }
  if (pathname.includes("presentation")) {
    return ["Generate talking points for this slide", "Explain this concept simply", "Handle common objections"];
  }
  return ["Help me with this case", "What should I do next?", "Check compliance requirements"];
}

export function AIAssistantPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const location = useLocation();

  const configured = isAIConfigured();
  const suggestions = getContextualSuggestions(location.pathname);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  const handleAbort = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
      setIsStreaming(false);
    }
  }, []);

  const handleSend = useCallback((text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;

    if (isStreaming) {
      handleAbort();
      return;
    }

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    let assistantContent = "";
    const assistantId = (Date.now() + 1).toString();

    streamChat({
      message: msg,
      pathname: location.pathname,
      signal: controller.signal,
      onDelta: (chunk) => {
        assistantContent += chunk;
        const content = assistantContent;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant" && last.id === assistantId) {
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content } : m));
          }
          return [...prev, { id: assistantId, role: "assistant", content }];
        });
      },
      onDone: () => {
        setIsStreaming(false);
        abortRef.current = null;
      },
      onError: (error) => {
        setIsStreaming(false);
        abortRef.current = null;
        toast({ title: "AI Error", description: error, variant: "destructive" });
      },
    });
  }, [input, isStreaming, handleAbort, location.pathname]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[60] bg-black/40" onClick={onClose} />

      {/* Panel */}
      <div
        className={cn(
          "fixed right-0 top-0 z-[70] flex h-full w-[400px] flex-col border-l border-border bg-card shadow-elevated animate-in slide-in-from-right duration-300",
          minimized && "h-14"
        )}
      >
        {/* Header */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <MessageCircle className="h-5 w-5 text-primary" />
              <span
                className={cn(
                  "absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full",
                  configured ? "bg-primary animate-pulse" : "bg-warning"
                )}
              />
            </div>
            <span className="text-sm font-semibold text-foreground">FinBox AI</span>
            {!configured && (
              <span className="text-[10px] text-warning font-medium">Not configured</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMinimized(!minimized)}
              className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:text-foreground transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!minimized && (
          <>
            {/* Not configured banner */}
            {!configured && (
              <div className="mx-4 mt-3 flex items-start gap-2.5 rounded-lg border border-warning/20 bg-warning/5 px-3 py-2.5">
                <AlertCircle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium text-foreground mb-0.5">AnythingLLM not configured</p>
                  <p>
                    Go to{" "}
                    <Link
                      to="/settings"
                      onClick={onClose}
                      className="text-primary underline underline-offset-2 hover:text-primary/80"
                    >
                      Settings → AI Assistant
                    </Link>{" "}
                    to connect your local LLM.
                  </p>
                </div>
              </div>
            )}

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && configured && (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <MessageCircle className="h-10 w-10 text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground/70">Ask me anything about insurance products, compliance, or your current case.</p>
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-secondary text-foreground rounded-bl-sm"
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex justify-start">
                  <div className="bg-secondary rounded-xl rounded-bl-sm px-4 py-3 flex gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            <div className="flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-none">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  disabled={isStreaming}
                  className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors disabled:opacity-40"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="border-t border-border p-3">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder="Ask me anything about the case..."
                  className="flex-1 rounded-button border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
                  disabled={!configured}
                />
                <button
                  onClick={() => isStreaming ? handleAbort() : handleSend()}
                  disabled={!configured || (!input.trim() && !isStreaming)}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-button transition-colors disabled:opacity-40",
                    isStreaming
                      ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                >
                  {isStreaming ? <Square className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
