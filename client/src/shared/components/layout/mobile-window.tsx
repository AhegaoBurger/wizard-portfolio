import type React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MobileWindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  isActive: boolean;
  onCloseAction: () => void;
}

export default function MobileWindow({
  id,
  title,
  children,
  isActive,
  onCloseAction,
}: MobileWindowProps) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          key={id}
          className="fixed inset-0 z-40 p-2 pt-12 pb-16"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
        >
          <div className="w-full h-full window-chrome flex flex-col">
            <div className="window-title-bar px-2 flex justify-between items-center">
              <div className="text-center flex-1">{title}</div>
              <button
                className="w-5 h-5 flex items-center justify-center"
                onClick={onCloseAction}
              >
                x
              </button>
            </div>
            <div className="p-2 flex-1 overflow-auto">{children}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
