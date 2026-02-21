import type React from "react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import TabBar from "@/shared/components/navigation/tab-bar";
import MobileWindow from "@/shared/components/layout/mobile-window";
import Clock from "@/shared/components/navigation/clock";
import ManaBar from "@/shared/components/navigation/mana-bar";

interface MobileLayoutProps {
  windows: {
    id: string;
    title: string;
    icon: string;
    content: React.ReactNode;
  }[];
}

export default function MobileLayout({ windows }: MobileLayoutProps) {
  const navigate = useNavigate();
  const [activeWindow, setActiveWindow] = useState<string | null>(null);

  const handleTabChange = (tabId: string) => {
    if (activeWindow === tabId) {
      setActiveWindow(null);
    } else {
      setActiveWindow(tabId);
    }
  };

  const tabs = windows.map((window) => ({
    id: window.id,
    label: window.title.split("_")[0],
    icon: window.icon,
  }));

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white p-2 flex justify-between items-center glow-border">
        <button
          className="pixel-button px-2 py-1 text-white text-xs"
          onClick={() => navigate({ to: "/" })}
        >
          HOME
        </button>
        <ManaBar mobile />
      </div>

      <TabBar
        tabs={tabs}
        activeTab={activeWindow}
        onTabChangeAction={handleTabChange}
      />

      {windows.map((window) => (
        <MobileWindow
          key={window.id}
          id={window.id}
          title={window.title}
          isActive={activeWindow === window.id}
          onCloseAction={() => setActiveWindow(null)}
        >
          {window.content}
        </MobileWindow>
      ))}

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-white p-2 flex justify-center glow-border">
        <Clock />
      </div>
    </div>
  );
}
