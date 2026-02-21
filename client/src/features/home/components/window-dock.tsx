import { motion, AnimatePresence } from "framer-motion";

interface WindowDockProps {
  minimizedWindows: { id: string; title: string }[];
  onRestore: (id: string) => void;
}

export default function WindowDock({ minimizedWindows, onRestore }: WindowDockProps) {
  if (minimizedWindows.length === 0) return null;

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-[90] flex items-center gap-1 bg-black border border-white px-2 py-1 glow-border">
      <AnimatePresence>
        {minimizedWindows.map((win) => (
          <motion.button
            key={win.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="px-2 py-0.5 border border-white text-white text-[10px] font-pixel hover:bg-white hover:text-black transition-colors"
            onClick={() => onRestore(win.id)}
          >
            {win.title}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
