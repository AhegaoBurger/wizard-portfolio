import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import Window from "@/shared/components/layout/window";
import PageShell from "@/shared/components/layout/page-shell";
import LoadingScreen from "@/shared/components/layout/loading-screen";
import ParticleEffect from "@/shared/components/interactive/particle-effect";
import MobileLayout from "@/shared/components/layout/mobile-layout";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { useProjects } from "@/features/grimoire/api/grimoire.hooks";
import type { Project } from "@shared/types";

function DifficultyIndicator({ level }: { level: number }) {
  return (
    <div className="flex gap-px">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`w-2.5 h-2.5 ${i < level ? "bg-white" : "border border-white/30"}`}
        />
      ))}
    </div>
  );
}

function TechTags({ tech }: { tech: string[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {tech.map((t) => (
        <span key={t} className="border border-white/50 px-1 text-xs text-white/80">
          {t}
        </span>
      ))}
    </div>
  );
}

function ProjectDetails({ project }: { project: Project }) {
  return (
    <div className="p-2">
      <div className="mb-3 border border-white p-2">
        <div className="flex justify-between mb-2">
          <span className="text-white text-sm font-bold">Type:</span>
          <span className="text-white text-sm">{project.type}</span>
        </div>
        {project.difficulty && (
          <div className="flex justify-between mb-2">
            <span className="text-white text-sm font-bold">Difficulty:</span>
            <DifficultyIndicator level={project.difficulty} />
          </div>
        )}
        <div className="flex justify-between mb-2">
          <span className="text-white text-sm font-bold">Status:</span>
          <span className="text-white text-sm">
            {project.completion === 100 ? "Complete" : "In Progress"}
          </span>
        </div>
        <div className="w-full h-4 border border-white flex">
          <div className="h-full bg-pattern-checker" style={{ width: `${project.completion}%` }} />
        </div>
      </div>

      {project.tech && project.tech.length > 0 && (
        <div className="mb-3">
          <div className="text-white text-sm font-bold mb-1">Tech:</div>
          <TechTags tech={project.tech} />
        </div>
      )}

      {project.challenge && (
        <div className="mb-3">
          <div className="text-white text-sm font-bold mb-1">Challenge:</div>
          <p className="text-white text-xs border border-white p-2">{project.challenge}</p>
        </div>
      )}

      {project.approach && (
        <div className="mb-3">
          <div className="text-white text-sm font-bold mb-1">Approach:</div>
          <p className="text-white text-xs border border-white p-2">{project.approach}</p>
        </div>
      )}

      {project.outcome && (
        <div className="mb-3">
          <div className="text-white text-sm font-bold mb-1">Outcome:</div>
          <p className="text-white text-xs border border-white p-2">{project.outcome}</p>
        </div>
      )}

      <div className="mb-3">
        <div className="text-white text-sm font-bold mb-1">Features:</div>
        <div className="border border-white p-2">
          {project.features.map((feature, index) => (
            <div key={index} className="flex items-start mb-1 last:mb-0">
              <div className="w-3 h-3 border border-white mr-2 mt-px" />
              <span className="text-white text-xs">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GrimoirePage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { projects, loading } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  if (loading) {
    return <LoadingScreen />;
  }

  if (isMobile) {
    const projectListContent = (
      <div className="flex flex-col gap-2">
        <div className="border border-white p-2 mb-2">
          <h2 className="text-heading text-center mb-2">PROJECT GRIMOIRE</h2>
          <p className="text-white text-xs text-center">Tap projects to view engineering details</p>
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
                <span className="text-white font-bold text-sm">{project.name}</span>
                {project.completion === 100 && (
                  <div className="border border-white px-1 text-xs bg-white text-black">DONE</div>
                )}
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-white text-xs">{project.type}</span>
                {project.difficulty && <DifficultyIndicator level={project.difficulty} />}
              </div>
              <div className="w-full h-4 border border-white flex">
                <div className="h-full bg-pattern-checker" style={{ width: `${project.completion}%` }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );

    const projectDetailsContent = selectedProject ? (
      <ProjectDetails project={selectedProject} />
    ) : (
      <div className="flex items-center justify-center h-full">
        <p className="text-white text-center">Select a project to view details</p>
      </div>
    );

    const windows = [
      { id: "projects", title: "Project_Grimoire", icon: "G", content: projectListContent },
      { id: "details", title: "Project_Details", icon: "D", content: projectDetailsContent },
    ];

    return <MobileLayout windows={windows} />;
  }

  return (
    <PageShell>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <Window title="Project_Grimoire" width="w-80" height="h-96" x="left-4" y="top-4">
          <div className="flex flex-col gap-2 h-full">
            <div className="border border-white p-2 mb-2">
              <h2 className="text-heading text-center mb-2">PROJECT GRIMOIRE</h2>
              <p className="text-white text-xs text-center">Hover over projects to see magic particles</p>
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
                    <span className="text-white font-bold text-sm glow-text">{project.name}</span>
                    {project.completion === 100 && (
                      <div className="border border-white px-1 text-xs bg-white text-black">DONE</div>
                    )}
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white text-xs">{project.type}</span>
                    {project.difficulty && <DifficultyIndicator level={project.difficulty} />}
                  </div>
                  <div className="w-full h-4 border border-white flex">
                    <div className="h-full bg-pattern-checker" style={{ width: `${project.completion}%` }} />
                  </div>
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
          <Window title={`Project: ${selectedProject.name}`} width="w-96" height="h-auto" x="right-4" y="top-4">
            <ProjectDetails project={selectedProject} />
          </Window>
        </motion.div>
      )}
    </PageShell>
  );
}
