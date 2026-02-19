import { ReactNode } from "react";
import { TitleBar } from "./TitleBar";
import { TopBar } from "./TopBar";
import { StatusBar } from "./StatusBar";
import { PageTransition } from "./PageTransition";

export function AppLayout({ children, onSignOut }: { children: ReactNode; onSignOut?: () => void }) {
  return (
    <div className="flex h-screen w-full flex-col bg-depth bg-noise">
      <div data-print-hide><TitleBar /></div>
      <div data-print-hide><TopBar onSignOut={onSignOut} /></div>
      <main className="flex-1 overflow-y-auto px-8 py-6">
        <div className="mx-auto max-w-[1600px]">
          <PageTransition>{children}</PageTransition>
        </div>
      </main>
      <div data-print-hide><StatusBar /></div>
    </div>
  );
}
