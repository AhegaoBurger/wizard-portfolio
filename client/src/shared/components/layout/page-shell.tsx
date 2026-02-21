import type React from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import BackButton from "@/shared/components/navigation/back-button";

export default function PageShell({
  children,
  showBackButton = true,
  backButtonDelay = 0.4,
}: {
  children: React.ReactNode;
  showBackButton?: boolean;
  backButtonDelay?: number;
}) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black p-4 font-pixel overflow-hidden relative">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}

          {showBackButton && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: backButtonDelay, duration: 0.3 }}
              className="fixed bottom-4 right-4"
            >
              <BackButton onClickAction={() => navigate({ to: "/" })} />
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
