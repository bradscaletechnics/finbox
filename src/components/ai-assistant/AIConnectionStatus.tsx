import { useEffect, useState } from "react";
import { Wifi, WifiOff, Loader2 } from "lucide-react";
import { testConnection } from "@/lib/ai-client";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  showLabel?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number; // milliseconds
}

type ConnectionStatus = "checking" | "online" | "offline" | "unconfigured";

export function AIConnectionStatus({
  className,
  showLabel = true,
  autoRefresh = true,
  refreshInterval = 30000, // 30 seconds default
}: Props) {
  const [status, setStatus] = useState<ConnectionStatus>("checking");
  const [message, setMessage] = useState<string>("");

  const checkConnection = async () => {
    setStatus("checking");
    const result = await testConnection();
    setStatus(result.ok ? "online" : result.message.includes("API key") ? "unconfigured" : "offline");
    setMessage(result.message);
  };

  useEffect(() => {
    checkConnection();

    if (autoRefresh) {
      const interval = setInterval(checkConnection, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const statusConfig = {
    checking: {
      icon: Loader2,
      color: "text-muted-foreground",
      bg: "bg-muted",
      label: "Checking...",
      iconClass: "animate-spin",
    },
    online: {
      icon: Wifi,
      color: "text-success",
      bg: "bg-success/10",
      label: "AI Online",
      iconClass: "",
    },
    offline: {
      icon: WifiOff,
      color: "text-destructive",
      bg: "bg-destructive/10",
      label: "AI Offline",
      iconClass: "",
    },
    unconfigured: {
      icon: WifiOff,
      color: "text-warning",
      bg: "bg-warning/10",
      label: "Not Configured",
      iconClass: "",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 transition-colors",
        config.bg,
        className
      )}
      title={message}
    >
      <Icon className={cn("h-3.5 w-3.5", config.color, config.iconClass)} />
      {showLabel && (
        <span className={cn("text-xs font-medium", config.color)}>
          {config.label}
        </span>
      )}
    </div>
  );
}

/**
 * Compact version for status bars
 */
export function AIConnectionDot({ className }: { className?: string }) {
  return <AIConnectionStatus className={className} showLabel={false} />;
}

/**
 * Full version with manual refresh button
 */
export function AIConnectionStatusWithRefresh({ className }: { className?: string }) {
  const [status, setStatus] = useState<ConnectionStatus>("checking");
  const [message, setMessage] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkConnection = async () => {
    setIsRefreshing(true);
    setStatus("checking");
    const result = await testConnection();
    setStatus(result.ok ? "online" : result.message.includes("API key") ? "unconfigured" : "offline");
    setMessage(result.message);
    setIsRefreshing(false);
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const statusConfig = {
    checking: {
      icon: Loader2,
      color: "text-muted-foreground",
      bg: "bg-muted",
      label: "Checking connection...",
      iconClass: "animate-spin",
    },
    online: {
      icon: Wifi,
      color: "text-success",
      bg: "bg-success/10",
      label: "AnythingLLM is online and ready",
      iconClass: "",
    },
    offline: {
      icon: WifiOff,
      color: "text-destructive",
      bg: "bg-destructive/10",
      label: "AnythingLLM is offline",
      iconClass: "",
    },
    unconfigured: {
      icon: WifiOff,
      color: "text-warning",
      bg: "bg-warning/10",
      label: "API key not configured",
      iconClass: "",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-3 py-1.5 transition-colors",
          config.bg
        )}
      >
        <Icon className={cn("h-4 w-4", config.color, config.iconClass)} />
        <span className={cn("text-sm font-medium", config.color)}>
          {config.label}
        </span>
      </div>
      <button
        onClick={checkConnection}
        disabled={isRefreshing}
        className="text-xs font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isRefreshing ? "Checking..." : "Refresh"}
      </button>
      {message && status !== "online" && (
        <p className="text-xs text-muted-foreground">{message}</p>
      )}
    </div>
  );
}
