import { useState, useCallback } from "react";

export type HomePhase = "boot" | "hero" | "desktop";

const BOOT_SEEN_KEY = "wizard-os-boot-seen";
const HERO_SEEN_KEY = "wizard-os-hero-seen";
export const DIALOG_SEEN_KEY = "wizard-os-dialog-seen";

export function useHomePhase() {
  const [phase, setPhase] = useState<HomePhase>(() => {
    try {
      if (localStorage.getItem(HERO_SEEN_KEY)) return "desktop";
      if (localStorage.getItem(BOOT_SEEN_KEY)) return "hero";
      return "boot";
    } catch {
      return "desktop";
    }
  });

  const completeBoot = useCallback(() => {
    try {
      localStorage.setItem(BOOT_SEEN_KEY, "1");
    } catch {
      // ignore
    }
    setPhase("hero");
  }, []);

  const completeHero = useCallback(() => {
    try {
      localStorage.setItem(HERO_SEEN_KEY, "1");
    } catch {
      // ignore
    }
    setPhase("desktop");
  }, []);

  const replayBoot = useCallback(() => {
    try {
      localStorage.removeItem(BOOT_SEEN_KEY);
      localStorage.removeItem(HERO_SEEN_KEY);
      localStorage.removeItem(DIALOG_SEEN_KEY);
    } catch {
      // ignore
    }
    setPhase("boot");
  }, []);

  return { phase, completeBoot, completeHero, replayBoot };
}
