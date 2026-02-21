import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";

interface MenuBarProps {
  onReplayBoot?: () => void;
  onOpenTerminal?: () => void;
}

interface MenuItem {
  label: string;
  action?: () => void;
  separator?: boolean;
  disabled?: boolean;
}

const WIZARD_ICON = "✦";

export default function MenuBar({ onReplayBoot, onOpenTerminal }: MenuBarProps) {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const copyEmail = useCallback(() => {
    navigator.clipboard.writeText("artur.wiseman@proton.me").catch(() => {
      // fallback: do nothing
    });
  }, []);

  const menus: Record<string, MenuItem[]> = {
    File: [
      { label: "Download Resume", action: () => console.log("Resume download placeholder") },
      { label: "", separator: true },
      { label: "Print", action: () => window.print() },
      { label: "Close Window", action: () => window.close() },
    ],
    Edit: [
      { label: "Undo", disabled: true },
      { label: "", separator: true },
      { label: "Copy Email", action: copyEmail },
    ],
    View: [
      { label: "Home", action: () => navigate({ to: "/" }) },
      { label: "Grimoire", action: () => navigate({ to: "/grimoire" }) },
      { label: "Spellbook", action: () => navigate({ to: "/spells" }) },
      { label: "Potions Lab", action: () => navigate({ to: "/potions" }) },
      { label: "", separator: true },
      { label: "Trash", action: () => navigate({ to: "/trash" }) },
    ],
    Special: [
      ...(onOpenTerminal ? [{ label: "Open Terminal", action: onOpenTerminal }] : []),
      { label: "About This Wizard", action: () => window.alert("Wizard OS v3.2.1\nBuilt with arcane magic and caffeine.") },
      ...(onReplayBoot ? [
        { label: "", separator: true },
        { label: "Force Restart", action: onReplayBoot },
      ] : []),
    ],
  };

  const menuNames = Object.keys(menus);

  useEffect(() => {
    if (!activeMenu) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveMenu(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [activeMenu]);

  const handleMenuClick = (name: string) => {
    setActiveMenu((prev) => (prev === name ? null : name));
  };

  const handleMenuHover = (name: string) => {
    if (activeMenu) setActiveMenu(name);
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.disabled || item.separator) return;
    setActiveMenu(null);
    item.action?.();
  };

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 right-0 z-[100] h-6 bg-white text-black font-pixel text-xs flex items-center border-b border-black select-none"
    >
      <div className="px-2 font-bold text-sm leading-none">{WIZARD_ICON}</div>

      {menuNames.map((name) => (
        <div key={name} className="relative">
          <button
            className={`px-3 h-6 flex items-center hover:bg-black hover:text-white transition-colors ${
              activeMenu === name ? "bg-black text-white" : ""
            }`}
            onClick={() => handleMenuClick(name)}
            onMouseEnter={() => handleMenuHover(name)}
          >
            {name}
          </button>

          {activeMenu === name && (
            <div className="absolute top-6 left-0 bg-white text-black border border-black min-w-[180px]"
              style={{ boxShadow: "2px 2px 0 rgba(0,0,0,0.3)" }}
            >
              {menus[name].map((item, i) =>
                item.separator ? (
                  <div key={i} className="border-t border-black my-0.5" />
                ) : (
                  <button
                    key={i}
                    className={`w-full text-left px-4 py-1 text-xs ${
                      item.disabled
                        ? "text-black/30 cursor-default"
                        : "hover:bg-black hover:text-white"
                    }`}
                    onClick={() => handleItemClick(item)}
                    disabled={item.disabled}
                  >
                    {item.label}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      ))}

      <div className="flex-1" />

      <MenuBarClock />
    </div>
  );
}

function MenuBarClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, "0");
      const m = now.getMinutes().toString().padStart(2, "0");
      const ampm = now.getHours() >= 12 ? "PM" : "AM";
      setTime(`${h}:${m} ${ampm}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return <div className="px-3 text-xs font-bold">{time}</div>;
}
