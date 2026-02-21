import { useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface HeroRevealProps {
  onComplete: () => void;
}

const AUTO_ADVANCE_DELAY = 2000;

export default function HeroReveal({ onComplete }: HeroRevealProps) {
  const handleSkip = useCallback(() => {
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const timer = setTimeout(onComplete, AUTO_ADVANCE_DELAY);
    return () => clearTimeout(timer);
  }, [onComplete]);

  useEffect(() => {
    const handleKeyDown = () => handleSkip();
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSkip]);

  return (
    <motion.div
      key="hero"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center"
      onClick={handleSkip}
    >
      <motion.h1
        initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-4xl sm:text-5xl md:text-6xl font-pixel text-white tracking-widest text-center glow-text"
        style={{
          textShadow:
            "0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(255,255,255,0.2), 0 0 80px rgba(255,255,255,0.1)",
        }}
      >
        ARTUR SHIROKOV
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="text-base sm:text-lg md:text-xl text-white/80 font-pixel tracking-[0.3em] mt-4"
      >
        Software Engineer
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.6, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="text-sm sm:text-base text-white/50 font-mono tracking-widest mt-2"
      >
        ML | Robotics | Systems
      </motion.p>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.8, duration: 0.6, ease: "easeInOut" }}
        className="w-32 h-px bg-white/30 mt-6"
      />
    </motion.div>
  );
}
