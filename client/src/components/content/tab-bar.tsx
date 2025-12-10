import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  icon: string;
  color?: string;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string | null;
  onTabChangeAction: (tabId: string) => void;
  position?: "left" | "right";
}

export default function TabBar({
  tabs,
  activeTab,
  onTabChangeAction,
  position = "right",
}: TabBarProps) {
  return (
    <div
      className={cn(
        "fixed top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2",
        position === "left" ? "left-0" : "right-0",
      )}
    >
      {tabs.map((tab) => (
        <motion.div
          key={tab.id}
          className={cn(
            "cursor-pointer border border-white bg-black",
            position === "left"
              ? "border-r-0 rounded-l-sm pl-1 pr-2"
              : "border-l-0 rounded-r-sm pl-2 pr-1",
            activeTab === tab.id && "bg-white",
          )}
          initial={{ x: position === "left" ? -30 : 30 }}
          animate={{ x: 0 }}
          whileHover={{
            x: position === "left" ? 5 : -5,
            backgroundColor: activeTab === tab.id ? "#fff" : "#333",
          }}
          onClick={() => onTabChangeAction(tab.id)}
        >
          <div
            className={cn(
              "py-3 flex items-center gap-2",
              position === "left" ? "justify-start" : "justify-end",
            )}
          >
            {position === "right" && (
              <span
                className={cn(
                  "text-xs font-bold",
                  activeTab === tab.id ? "text-black" : "text-white",
                )}
              >
                {tab.label}
              </span>
            )}
            <div
              className={cn(
                "w-6 h-6 flex items-center justify-center",
                activeTab === tab.id ? "text-black" : "text-white",
              )}
            >
              {tab.icon}
            </div>
            {position === "left" && (
              <span
                className={cn(
                  "text-xs font-bold",
                  activeTab === tab.id ? "text-black" : "text-white",
                )}
              >
                {tab.label}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
