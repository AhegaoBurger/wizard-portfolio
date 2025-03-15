"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Window from "@/components/window";
import Clock from "@/components/clock";
import BackButton from "@/components/back-button";
import ParticleEffect from "@/components/particle-effect";
import ManaBar from "@/components/mana-bar";
import MobileLayout from "@/components/mobile-layout";
import { useIsMobile } from "@/hooks/use-mobile";

type Project = {
  name: string;
  type: string;
  completion: number;
  description: string;
  features: string[];
};

const projects: Project[] = [
  {
    name: "Enchanted_Dashboard",
    type: "Web App",
    completion: 100,
    description:
      "A magical dashboard for monitoring spell effectiveness and tracking magical metrics in real-time.",
    features: [
      "Real-time data visualization",
      "User authentication",
      "Dark/light mode toggle",
      "Responsive design",
    ],
  },
  {
    name: "Potion_Tracker",
    type: "Mobile App",
    completion: 85,
    description:
      "Track brewing status of your magical concoctions with this cross-platform mobile application.",
    features: [
      "Inventory management",
      "Recipe database",
      "Brewing timers",
      "Ingredient substitutions",
    ],
  },
  {
    name: "Spell_Compiler",
    type: "Developer Tool",
    completion: 70,
    description:
      "Convert ancient runes to modern JavaScript with this innovative code transpiler.",
    features: [
      "Syntax highlighting",
      "Error detection",
      "Code optimization",
      "Multiple output formats",
    ],
  },
  {
    name: "Familiar_Finder",
    type: "Web Service",
    completion: 100,
    description:
      "Match wizards with their perfect animal companions using advanced matching algorithms.",
    features: [
      "Personality assessment",
      "Compatibility scoring",
      "Animal database",
      "Match recommendations",
    ],
  },
];

export default function GrimoirePage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  // Track mouse position for custom cursor (desktop only)
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

  if (isMobile) {
    const projectListContent = (
      <div className="flex flex-col gap-2">
        <div className="border border-white p-2 mb-2">
          <h2 className="text-white text-center font-bold mb-2">
            MAGICAL PROJECTS
          </h2>
          <p className="text-white text-xs text-center">
            Tap projects to view details
          </p>
        </div>

        <div className="flex-1 overflow-auto">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="p-2 mb-2 border border-white relative"
              onClick={() => setSelectedProject(project)}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-white font-bold text-sm">
                  {project.name}
                </span>
                {project.completion === 100 && (
                  <div className="border border-white px-1 text-xs bg-white text-black">
                    DONE
                  </div>
                )}
              </div>
              <p className="text-white text-xs mb-2">{project.type}</p>
              <div className="w-full h-4 border border-white flex">
                <div
                  className="h-full bg-pattern-checker"
                  style={{ width: `${project.completion}%` }}
                ></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );

    const projectDetailsContent = selectedProject ? (
      <div className="p-2">
        <div className="mb-4 border border-white p-2">
          <div className="flex justify-between mb-2">
            <span className="text-white text-sm font-bold">Type:</span>
            <span className="text-white text-sm">{selectedProject.type}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-white text-sm font-bold">Status:</span>
            <span className="text-white text-sm">
              {selectedProject.completion === 100 ? "Complete" : "In Progress"}
            </span>
          </div>
          <div className="w-full h-4 border border-white flex">
            <div
              className="h-full bg-pattern-checker"
              style={{ width: `${selectedProject.completion}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-white text-sm font-bold mb-1">Description:</div>
          <p className="text-white text-xs border border-white p-2">
            {selectedProject.description}
          </p>
        </div>

        <div className="mb-4">
          <div className="text-white text-sm font-bold mb-1">Features:</div>
          <div className="border border-white p-2">
            {selectedProject.features.map((feature, index) => (
              <div key={index} className="flex items-start mb-1 last:mb-0">
                <div className="w-3 h-3 border border-white mr-2 mt-px"></div>
                <span className="text-white text-xs">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ) : (
      <div className="flex items-center justify-center h-full">
        <p className="text-white text-center">
          Select a project to view details
        </p>
      </div>
    );

    const windows = [
      {
        id: "projects",
        title: "Project_Grimoire",
        icon: "📚",
        content: projectListContent,
      },
      {
        id: "details",
        title: "Project_Details",
        icon: "🔍",
        content: projectDetailsContent,
      },
    ];

    return <MobileLayout windows={windows} />;
  }

  return (
    <div className="min-h-screen bg-black p-4 font-pixel overflow-hidden relative">
      <ManaBar />

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Window
              title="Project_Grimoire"
              width="w-80"
              height="h-96"
              x="left-4"
              y="top-4"
            >
              <div className="flex flex-col gap-2 h-full">
                <div className="border border-white p-2 mb-2">
                  <h2 className="text-white text-center font-bold mb-2">
                    MAGICAL PROJECTS
                  </h2>
                  <p className="text-white text-xs text-center">
                    Hover over projects to see magic particles
                  </p>
                </div>

                <div className="flex-1 overflow-auto">
                  {projects.map((project, index) => (
                    <motion.div
                      key={index}
                      className="p-2 mb-2 border border-white cursor-pointer relative"
                      onClick={() => setSelectedProject(project)}
                      onHoverStart={() => setHoveredProject(index)}
                      onHoverEnd={() => setHoveredProject(null)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-white font-bold text-sm">
                          {project.name}
                        </span>
                        {project.completion === 100 && (
                          <div className="border border-white px-1 text-xs bg-white text-black">
                            DONE
                          </div>
                        )}
                      </div>
                      <p className="text-white text-xs mb-2">{project.type}</p>
                      <div className="w-full h-4 border border-white flex">
                        <div
                          className="h-full bg-pattern-checker"
                          style={{ width: `${project.completion}%` }}
                        ></div>
                      </div>

                      {/* Particle effect on hover */}
                      <ParticleEffect active={hoveredProject === index} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </Window>
          </motion.div>

          {selectedProject && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Window
                title={`Project: ${selectedProject.name}`}
                width="w-80"
                height="h-auto"
                x="right-4"
                y="top-4"
              >
                <div className="p-2">
                  <div className="mb-4 border border-white p-2">
                    <div className="flex justify-between mb-2">
                      <span className="text-white text-sm font-bold">
                        Type:
                      </span>
                      <span className="text-white text-sm">
                        {selectedProject.type}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-white text-sm font-bold">
                        Status:
                      </span>
                      <span className="text-white text-sm">
                        {selectedProject.completion === 100
                          ? "Complete"
                          : "In Progress"}
                      </span>
                    </div>
                    <div className="w-full h-4 border border-white flex">
                      <div
                        className="h-full bg-pattern-checker"
                        style={{ width: `${selectedProject.completion}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-white text-sm font-bold mb-1">
                      Description:
                    </div>
                    <p className="text-white text-xs border border-white p-2">
                      {selectedProject.description}
                    </p>
                  </div>

                  <div className="mb-4">
                    <div className="text-white text-sm font-bold mb-1">
                      Features:
                    </div>
                    <div className="border border-white p-2">
                      {selectedProject.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-start mb-1 last:mb-0"
                        >
                          <div className="w-3 h-3 border border-white mr-2 mt-px"></div>
                          <span className="text-white text-xs">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Window>
            </motion.div>
          )}

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="fixed bottom-4 right-4"
          >
            <BackButton onClickAction={() => router.push("/")} />
          </motion.div>

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
    </div>
  );
}
