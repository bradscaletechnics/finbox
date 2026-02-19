import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AchievementToast } from "@/components/ui/AchievementToast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useAutoLock } from "@/hooks/use-auto-lock";
import { DiscoveryProvider } from "@/components/discovery/DiscoveryContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { AIAssistantPanel } from "@/components/ai-assistant/AIAssistantPanel";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { PinScreen } from "@/components/onboarding/PinScreen";
import { MessageCircle } from "lucide-react";
import { ensureAdvisorWorkspace } from "@/lib/ai-client";
import { setFirstAdvisorAsAdmin } from "@/lib/advisor";
import Index from "./pages/Index";
import ClientDiscovery from "./pages/ClientDiscovery";
import HandoffPackage from "./pages/HandoffPackage";
import ActiveCases from "./pages/ActiveCases";
import NewCase from "./pages/NewCase";
import CaseDetail from "./pages/CaseDetail";
import Settings from "./pages/Settings";
import Presentations from "./pages/Presentations";
import Training from "./pages/Training";
import DocumentManager from "./pages/DocumentManager";
import PresentationMode from "./components/presentation/PresentationMode";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

type AppGate = "loading" | "onboarding" | "pin" | "unlocked";

function AppContent() {
  const [aiOpen, setAiOpen] = useState(false);
  const [gate, setGate] = useState<AppGate>("loading");
  const handleLock = useCallback(() => setGate("pin"), []);
  const handleCreateNew = useCallback(() => {
    // Clear current advisor data but keep admin record
    const admin = localStorage.getItem("finbox_admin");
    localStorage.removeItem("finbox_onboarded");
    localStorage.removeItem("finbox_pin");
    localStorage.removeItem("finbox_profile");
    localStorage.removeItem("finbox_preferences");
    if (admin) localStorage.setItem("finbox_admin", admin);
    setGate("onboarding");
  }, []);
  const isUnlocked = gate === "unlocked";
  const noop = useCallback(() => {}, []);
  useAutoLock(isUnlocked ? handleLock : noop);
  useEffect(() => {
    const onboarded = localStorage.getItem("finbox_onboarded");
    if (!onboarded) {
      setGate("onboarding");
    } else {
      setGate("pin");
    }
  }, []);

  // Ensure advisor workspace exists when app unlocks
  useEffect(() => {
    if (gate === "unlocked") {
      ensureAdvisorWorkspace().catch(error => {
        console.error("Failed to create advisor workspace:", error);
      });
    }
  }, [gate]);

  if (gate === "loading") return null;

  if (gate === "onboarding") {
    return (
      <OnboardingFlow
        onComplete={(profile, preferences) => {
          // Set first advisor as admin
          setFirstAdvisorAsAdmin(profile.email);

          localStorage.setItem("finbox_onboarded", "true");
          localStorage.setItem("finbox_pin", preferences.pin);
          localStorage.setItem("finbox_profile", JSON.stringify(profile));
          localStorage.setItem("finbox_preferences", JSON.stringify(preferences));
          setGate("unlocked");
        }}
      />
    );
  }

  if (gate === "pin") {
    return (
      <PinScreen
        onUnlock={() => setGate("unlocked")}
        onCreateNew={handleCreateNew}
      />
    );
  }

  return (
    <DiscoveryProvider>
      <Routes>
        {/* Presentation player — no layout wrapper */}
        <Route path="/presentations/play" element={<PresentationMode />} />

        {/* All other routes use AppLayout */}
        <Route
          path="*"
          element={
            <AppLayout onSignOut={() => setGate("pin")}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/presentations" element={<Presentations />} />
                <Route path="/client-discovery" element={<ClientDiscovery />} />
                <Route path="/handoff-package" element={<HandoffPackage />} />
                <Route path="/active-cases" element={<ActiveCases />} />
                <Route path="/active-cases/:caseId" element={<CaseDetail />} />
                <Route path="/new-case" element={<NewCase />} />
                <Route path="/training" element={<Training />} />
                <Route path="/documents" element={<DocumentManager />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          }
        />
      </Routes>

      {/* Global floating AI button (hidden in presentation player) */}
      <Routes>
        <Route path="/presentations/play" element={null} />
        <Route
          path="*"
          element={
            !aiOpen ? (
              <button
                onClick={() => setAiOpen(true)}
                className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-elevated hover:bg-primary/90 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                Ask FinBox AI
              </button>
            ) : null
          }
        />
      </Routes>

      {/* AI Assistant Panel */}
      <AIAssistantPanel open={aiOpen} onClose={() => setAiOpen(false)} />
    </DiscoveryProvider>
  );
}

const Router = window.location.protocol === "file:" ? HashRouter : BrowserRouter;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AchievementToast />
      <Router>
        <AppContent />
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
