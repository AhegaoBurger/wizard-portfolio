import { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BootSequenceProps {
  onComplete: () => void;
}

const BOOT_LINES = [
  { text: "[Wizard OS v3.2.1]", delay: 0 },
  { text: "Loading arcane modules", dots: true, delay: 300 },
  { text: "Initializing spell compiler", dots: true, delay: 700 },
  { text: "Mounting grimoire filesystem", dots: true, delay: 1100 },
  { text: "Establishing mana connection", dots: true, delay: 1500 },
  { text: "", delay: 1900 },
  { text: "> Welcome, traveler.", delay: 2100 },
  { text: "> Artur Shirokov — Software Engineer", delay: 2500 },
  { text: "> ML | Robotics | Systems", delay: 2900 },
];

const TOTAL_DURATION = 3500;

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [dotsComplete, setDotsComplete] = useState<Set<number>>(new Set());

  const handleSkip = useCallback(() => {
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const handleKeyDown = () => handleSkip();
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSkip]);

  // Reveal lines progressively
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_LINES.forEach((line, index) => {
      timers.push(
        setTimeout(() => {
          setVisibleLines((prev) => Math.max(prev, index + 1));
        }, line.delay)
      );

      // Mark dots as complete after 300ms
      if (line.dots) {
        timers.push(
          setTimeout(() => {
            setDotsComplete((prev) => new Set(prev).add(index));
          }, line.delay + 300)
        );
      }
    });

    // Auto-advance after total duration
    timers.push(setTimeout(onComplete, TOTAL_DURATION));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div
      key="boot"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black z-50 flex flex-col justify-center px-6 sm:px-16 md:px-32"
      onClick={handleSkip}
    >
      <div className="font-mono text-sm sm:text-base text-white max-w-2xl">
        {BOOT_LINES.slice(0, visibleLines).map((line, index) => {
          if (line.text === "") {
            return <div key={index} className="h-4" />;
          }

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center mb-1"
            >
              {line.dots ? (
                <>
                  <span className="text-white/80">{line.text}</span>
                  <span className="mx-1">
                    <DotsAnimation complete={dotsComplete.has(index)} />
                  </span>
                  <AnimatePresence>
                    {dotsComplete.has(index) && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-white font-bold ml-1"
                      >
                        OK
                      </motion.span>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <span
                  className={
                    line.text.startsWith(">")
                      ? "text-white font-bold"
                      : "text-white/60"
                  }
                >
                  {line.text}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-8 left-0 right-0 text-center font-mono text-xs text-white/40"
      >
        Press any key to skip
      </motion.div>
    </motion.div>
  );
}

function DotsAnimation({ complete }: { complete: boolean }) {
  return (
    <span className="inline-block overflow-hidden">
      <motion.span
        className="text-white/40"
        initial={{ width: 0 }}
        animate={{ width: complete ? "auto" : "auto" }}
        transition={{ duration: 0.3 }}
      >
        ..........
      </motion.span>
    </span>
  );
}
