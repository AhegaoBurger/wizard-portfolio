import { useState, useEffect, useRef } from "react";

import DesktopLayout from "@/shared/components/layout/desktop-layout";
import WizardProfile from "@/features/home/components/wizard-profile";
import ProjectsWindow from "@/features/home/components/projects-window";
import SkillsWindow from "@/features/home/components/skills-window";
import ContactWindow from "@/features/home/components/contact-window";
import BootSequence from "@/features/home/components/boot-sequence";
import HeroReveal from "@/features/home/components/hero-reveal";
import TerminalWindow from "@/features/home/components/terminal-window";
import WindowDock from "@/features/home/components/window-dock";
import Starfield from "@/shared/components/interactive/starfield";
import DialogBox from "@/shared/components/interactive/dialog-box";
import FolderIcon from "@/shared/components/navigation/folder-icon";
import MobileLayout from "@/shared/components/layout/mobile-layout";
import Window from "@/shared/components/layout/window";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { useHomePhase, DIALOG_SEEN_KEY } from "@/features/home/hooks/use-home-phase";
import { useWindowManager } from "@/features/home/hooks/use-window-manager";
import { useSetMenuBarActions } from "@/features/home/components/menu-bar-context";
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";

const WINDOW_IDS = ["profile", "projects", "skills", "contact"];
const WINDOW_TITLES: Record<string, string> = {
  profile: "Wizard_Profile",
  projects: "Grimoire",
  skills: "Magical_Skills",
  contact: "Send_Message",
  terminal: "Terminal",
};

const springTransition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 20,
};

export default function HomePage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { phase, completeBoot, completeHero, replayBoot } = useHomePhase();
  const { bringToFront, minimize, restore, getZIndex, isMinimized, minimizedWindows } =
    useWindowManager(WINDOW_IDS);

  const [showDialog, setShowDialog] = useState(() => {
    try {
      return !localStorage.getItem(DIALOG_SEEN_KEY);
    } catch {
      return false;
    }
  });
  const dismissDialog = () => {
    setShowDialog(false);
    try {
      localStorage.setItem(DIALOG_SEEN_KEY, "1");
    } catch {
      // ignore
    }
  };
  const [showTerminal, setShowTerminal] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const setMenuBarActions = useSetMenuBarActions();

  // Register home-specific menu bar actions (Open Terminal, Force Restart)
  useEffect(() => {
    setMenuBarActions({
      onReplayBoot: () => { replayBoot(); setShowDialog(true); },
      onOpenTerminal: () => setShowTerminal(true),
    });
    return () => setMenuBarActions({});
  }, [setMenuBarActions, replayBoot]);

  const navigateTo = (path: string) => {
    setTimeout(() => {
      navigate({ to: path });
    }, 300);
  };

  // --- Mobile: boot + hero play, then show MobileLayout ---
  if (isMobile) {
    if (phase === "boot") {
      return <BootSequence onComplete={completeBoot} />;
    }
    if (phase === "hero") {
      return <HeroReveal onComplete={completeHero} />;
    }

    const terminalContent = <TerminalWindow mobile />;
    const profileContent = <WizardProfile />;
    const projectsContent = <ProjectsWindow />;
    const skillsContent = <SkillsWindow />;
    const contactContent = <ContactWindow />;

    const windows = [
      { id: "profile", title: "Wizard_Profile", icon: "W", content: profileContent },
      { id: "projects", title: "Grimoire", icon: "G", content: projectsContent },
      { id: "skills", title: "Magical_Skills", icon: "S", content: skillsContent },
      { id: "contact", title: "Send_Message", icon: "M", content: contactContent },
      { id: "terminal", title: "Terminal", icon: ">", content: terminalContent },
    ];

    return (
      <div className="min-h-screen bg-black overflow-hidden">
        <MobileLayout windows={windows} />

        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 flex flex-row items-center gap-4 z-40">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateTo("/spells")}
          >
            <FolderIcon label="Spellbook" />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateTo("/grimoire")}
          >
            <FolderIcon label="Grimoire" />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateTo("/quests")}
          >
            <FolderIcon label="Quests" />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateTo("/laboratory")}
          >
            <FolderIcon label="Lab" />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateTo("/trash")}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-6 h-8 border border-white flex items-end justify-center">
              <div className="w-4 h-2 bg-white"></div>
            </div>
            <span className="text-xs text-white">Trash</span>
          </motion.div>
        </div>

        {showDialog && <DialogBox onCloseAction={dismissDialog} />}
      </div>
    );
  }

  // --- Desktop: full phase machine ---
  return (
    <AnimatePresence mode="wait">
      {phase === "boot" && (
        <BootSequence key="boot" onComplete={completeBoot} />
      )}

      {phase === "hero" && (
        <HeroReveal key="hero" onComplete={completeHero} />
      )}

      {phase === "desktop" && (
        <motion.div
          key="desktop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <DesktopLayout>
            <Starfield />

            {/* Drag constraint area */}
            <div ref={constraintsRef} className="fixed inset-0 pointer-events-none" />

            <div className="relative z-10">
              {/* WizardProfile — flies from LEFT */}
              {!isMinimized("profile") && (
                <motion.div
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ ...springTransition, delay: 0.1 }}
                >
                  <Window
                    title="Wizard_Profile"
                    width="w-64"
                    height="h-80"
                    x="left-4"
                    y="top-4"
                    draggable
                    dragConstraints={constraintsRef}
                    zIndex={getZIndex("profile")}
                    onFocus={() => bringToFront("profile")}
                    onMinimize={() => minimize("profile")}
                  >
                    <WizardProfileContent />
                  </Window>
                </motion.div>
              )}

              {/* ProjectsWindow — flies from BOTTOM-LEFT */}
              {!isMinimized("projects") && (
                <motion.div
                  initial={{ x: -200, y: 200, opacity: 0 }}
                  animate={{ x: 0, y: 0, opacity: 1 }}
                  transition={{ ...springTransition, delay: 0.2 }}
                >
                  <Window
                    title="Grimoire"
                    width="w-72"
                    height="h-auto"
                    x="left-4"
                    y="top-[22rem]"
                    draggable
                    dragConstraints={constraintsRef}
                    zIndex={getZIndex("projects")}
                    onFocus={() => bringToFront("projects")}
                    onMinimize={() => minimize("projects")}
                  >
                    <ProjectsWindowContent />
                  </Window>
                </motion.div>
              )}

              {/* SkillsWindow — flies from RIGHT */}
              {!isMinimized("skills") && (
                <motion.div
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ ...springTransition, delay: 0.3 }}
                >
                  <Window
                    title="Magical_Skills"
                    width="w-64"
                    height="h-auto"
                    x="right-4"
                    y="top-4"
                    draggable
                    dragConstraints={constraintsRef}
                    zIndex={getZIndex("skills")}
                    onFocus={() => bringToFront("skills")}
                    onMinimize={() => minimize("skills")}
                  >
                    <SkillsWindowContent />
                  </Window>
                </motion.div>
              )}

              {/* ContactWindow — flies from BOTTOM-RIGHT */}
              {!isMinimized("contact") && (
                <motion.div
                  initial={{ x: 200, y: 200, opacity: 0 }}
                  animate={{ x: 0, y: 0, opacity: 1 }}
                  transition={{ ...springTransition, delay: 0.4 }}
                >
                  <Window
                    title="Send_Message"
                    width="w-72"
                    height="h-auto"
                    x="right-4"
                    y="top-[22rem]"
                    draggable
                    dragConstraints={constraintsRef}
                    zIndex={getZIndex("contact")}
                    onFocus={() => bringToFront("contact")}
                    onMinimize={() => minimize("contact")}
                  >
                    <ContactWindowContent />
                  </Window>
                </motion.div>
              )}

              {/* Terminal Window */}
              <AnimatePresence>
                {showTerminal && !isMinimized("terminal") && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Window
                      title="Terminal"
                      width="w-[480px]"
                      height="h-auto"
                      x="left-[25%]"
                      y="top-[20%]"
                      draggable
                      dragConstraints={constraintsRef}
                      zIndex={getZIndex("terminal")}
                      onFocus={() => bringToFront("terminal")}
                      onMinimize={() => minimize("terminal")}
                      onClose={() => setShowTerminal(false)}
                    >
                      <TerminalWindow />
                    </Window>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Folder Icons */}
              <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex flex-row items-center gap-4">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigateTo("/spells")}
                >
                  <FolderIcon label="Spellbook" />
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigateTo("/grimoire")}
                >
                  <FolderIcon label="Grimoire" />
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigateTo("/quests")}
                >
                  <FolderIcon label="Quests" />
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigateTo("/laboratory")}
                >
                  <FolderIcon label="Lab" />
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.0, duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigateTo("/trash")}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="w-6 h-8 border border-white flex items-end justify-center">
                    <div className="w-4 h-2 bg-white"></div>
                  </div>
                  <span className="text-xs text-white">Trash</span>
                </motion.div>
              </div>

              {showDialog && (
                <DialogBox onCloseAction={dismissDialog} />
              )}

              {/* Window Dock */}
              <WindowDock
                minimizedWindows={Array.from(minimizedWindows).map((id) => ({
                  id,
                  title: WINDOW_TITLES[id] || id,
                }))}
                onRestore={restore}
              />
            </div>
          </DesktopLayout>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- Extracted content components to avoid wrapping original components that include Window ---

import { useQuery, queryOptions } from "@tanstack/react-query";
import { fetchAPI } from "@/shared/lib/api-client";
import type { Profile, ProjectsData, SkillsData } from "@shared/types";

const profileQueryOptions = queryOptions({
  queryKey: ["profile"],
  queryFn: () => fetchAPI<Profile>("/content/profile"),
});

function WizardProfileContent() {
  const { data: profile } = useQuery(profileQueryOptions);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full h-32 bg-pattern-diagonal mb-2 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-sm mb-1">
            {profile?.avatar?.animation ?? "Casting Spells..."}
          </div>
          <div className="wizard-hat w-12 h-12 mx-auto"></div>
        </div>
      </div>

      <div className="w-full border border-white p-2 mb-2">
        <h2 className="text-white text-center font-bold mb-2 glow-text">
          {profile?.name ?? "ARTUR SHIROKOV"}
        </h2>
        <p className="text-white text-xs text-center text-subtitle">
          {profile?.title ?? "Software Engineer"}
        </p>
        {profile?.tagline && (
          <p className="text-white/60 text-xs text-center mt-1">{profile.tagline}</p>
        )}
        <p className="text-white text-xs text-center mt-1">
          {profile?.location ?? "Lisbon, PT"}
        </p>
      </div>

      <div className="w-full flex justify-between">
        <button className="pixel-button w-12 h-12 flex items-center justify-center">
          <div className="w-6 h-6 bg-white mask-icon-code"></div>
        </button>
        <button className="pixel-button w-12 h-12 flex items-center justify-center">
          <div className="w-6 h-6 bg-white mask-icon-wand"></div>
        </button>
        <button className="pixel-button w-12 h-12 flex items-center justify-center">
          <div className="w-6 h-6 bg-white mask-icon-book"></div>
        </button>
      </div>
    </div>
  );
}

const projectsQueryOptions = queryOptions({
  queryKey: ["projects"],
  queryFn: () => fetchAPI<ProjectsData>("/content/projects"),
  select: (data) => data.projects.slice(0, 3),
});

function ProjectsWindowContent() {
  const { data: projects } = useQuery(projectsQueryOptions);

  const displayProjects = projects ?? [
    { name: "Trading_Dashboard", description: "Real-time trading platform", type: "Systems", completion: 100 },
    { name: "Canister_Cloud", description: "E2E encrypted storage", type: "Security", completion: 100 },
    { name: "Portfolio_Analytics", description: "Cross-exchange analytics", type: "Data Engineering", completion: 90 },
  ];

  return (
    <div className="flex flex-col gap-3">
      {displayProjects.map((project, index) => (
        <div key={index} className="border border-white p-2">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-white font-bold text-sm glow-text">{project.name}</h3>
            {project.completion === 100 && (
              <div className="border border-white px-1 text-xs bg-white text-black">DONE</div>
            )}
          </div>
          <p className="text-white text-xs mb-1">{project.type}</p>
          <p className="text-white text-xs mb-2 text-white/60">{project.description}</p>
          <div className="w-full h-4 border border-white flex">
            <div className="h-full bg-pattern-checker" style={{ width: `${project.completion}%` }}></div>
          </div>
        </div>
      ))}
    </div>
  );
}

const skillsQueryOptions = queryOptions({
  queryKey: ["skills"],
  queryFn: () => fetchAPI<SkillsData>("/content/skills"),
  select: (data) => data.skills.filter((s) => s.category === "Category"),
});

function SkillsWindowContent() {
  const { data: skills } = useQuery(skillsQueryOptions);

  const displaySkills = skills ?? [
    { name: "ML/AI", level: 2 },
    { name: "Robotics", level: 1 },
    { name: "Systems", level: 4 },
    { name: "Frontend", level: 5 },
    { name: "Backend", level: 5 },
    { name: "Security", level: 5 },
  ];

  return (
    <>
      <div className="grid grid-cols-4 gap-2 border border-white p-2 mb-2">
        {[16, 8, 4, 2, 32, 64, 128, 1, 512, 256, 1024, 2048].map((num, i) => (
          <div key={i} className="border border-white h-8 flex items-center justify-center">
            <span className="text-white text-xs">{num}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {displaySkills.map((skill, index) => (
          <div key={index} className="flex items-center">
            <div className="w-20 text-white text-xs">{skill.name}</div>
            <div className="flex-1 h-4 border border-white flex items-center px-1">
              <div className="relative w-full h-2">
                <div className="absolute inset-0 bg-pattern-dots"></div>
                <div
                  className="absolute top-0 bottom-0 left-0 bg-white"
                  style={{ width: `${skill.level * 20}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function ContactWindowContent() {
  const [message, setMessage] = useState("");

  return (
    <div className="flex flex-col gap-3">
      <div className="border border-white p-2">
        <h2 className="text-heading text-center mb-2">CONTACT WIZARD</h2>
        <p className="text-white text-xs text-center mb-2">artur.wiseman@proton.me</p>
        <div className="flex flex-col gap-2">
          <div className="flex">
            <label className="w-16 text-white text-xs">Name:</label>
            <input type="text" className="flex-1 pixel-input border border-white text-white text-xs p-1" />
          </div>
          <div className="flex">
            <label className="w-16 text-white text-xs">Email:</label>
            <input type="email" className="flex-1 pixel-input border border-white text-white text-xs p-1" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-white text-xs">Message:</label>
            <textarea
              className="w-full h-20 pixel-input border border-white text-white text-xs p-1 resize-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <button className="pixel-button px-2 py-1 text-white text-xs">CLEAR</button>
        <button className="pixel-button px-2 py-1 bg-white text-black text-xs">SEND</button>
      </div>
    </div>
  );
}
