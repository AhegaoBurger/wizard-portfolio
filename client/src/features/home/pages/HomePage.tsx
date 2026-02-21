import { useState, useEffect } from "react";
import DesktopLayout from "@/shared/components/layout/desktop-layout";
import WizardProfile from "@/features/home/components/wizard-profile";
import ProjectsWindow from "@/features/home/components/projects-window";
import SkillsWindow from "@/features/home/components/skills-window";
import ContactWindow from "@/features/home/components/contact-window";
import DialogBox from "@/shared/components/interactive/dialog-box";
import Clock from "@/shared/components/navigation/clock";
import FolderIcon from "@/shared/components/navigation/folder-icon";
import ManaBar from "@/shared/components/navigation/mana-bar";
import MobileLayout from "@/shared/components/layout/mobile-layout";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";

export default function HomePage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showDialog, setShowDialog] = useState(true);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isMobile]);

  const navigateTo = (path: string) => {
    setIsClicking(true);
    setTimeout(() => {
      navigate({ to: path });
    }, 300);
  };

  if (isMobile) {
    const profileContent = <WizardProfile />;
    const projectsContent = <ProjectsWindow />;
    const skillsContent = <SkillsWindow />;
    const contactContent = <ContactWindow />;

    const windows = [
      { id: "profile", title: "Wizard_Profile", icon: "W", content: profileContent },
      { id: "projects", title: "Grimoire", icon: "G", content: projectsContent },
      { id: "skills", title: "Magical_Skills", icon: "S", content: skillsContent },
      { id: "contact", title: "Send_Message", icon: "M", content: contactContent },
    ];

    return (
      <div className="min-h-screen bg-black overflow-hidden">
        <MobileLayout windows={windows} />

        <div className="fixed bottom-16 right-4 flex flex-col items-center gap-4 z-40">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateTo("/spells")}
          >
            <FolderIcon label="Spells" />
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
            onClick={() => navigateTo("/potions")}
          >
            <FolderIcon label="Potions" />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.3 }}
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

        {showDialog && <DialogBox onCloseAction={() => setShowDialog(false)} />}
      </div>
    );
  }

  return (
    <DesktopLayout>
      <ManaBar />

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <WizardProfile />
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <ProjectsWindow />
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <SkillsWindow />
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <ContactWindow />
          </motion.div>

          <div className="fixed bottom-4 right-4 flex flex-col items-center gap-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateTo("/spells")}
            >
              <FolderIcon label="Spells" />
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
              onClick={() => navigateTo("/potions")}
            >
              <FolderIcon label="Potions" />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.3 }}
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
            <DialogBox onCloseAction={() => setShowDialog(false)} />
          )}
          <Clock />

          {/* Custom cursor */}
          <div
            className="fixed pointer-events-none z-50"
            style={{
              left: `${cursorPosition.x}px`,
              top: `${cursorPosition.y}px`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              className={`w-4 h-4 border border-white ${isClicking ? "bg-white" : ""}`}
            ></div>
          </div>
        </motion.div>
      </AnimatePresence>
    </DesktopLayout>
  );
}
