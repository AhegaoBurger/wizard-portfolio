import Window from "@/components/window"

const projects = [
  {
    name: "Spell_Compiler",
    description: "Convert ancient runes to modern JavaScript",
    progress: 75,
  },
  {
    name: "Potion_API",
    description: "RESTful API for magical ingredients",
    progress: 100,
  },
  {
    name: "Familiar_Finder",
    description: "Match wizards with their perfect companions",
    progress: 60,
  },
]

export default function ProjectsWindow() {
  return (
    <Window title="Grimoire" width="w-72" height="h-auto" x="left-4" y="top-[22rem]">
      <div className="flex flex-col gap-3">
        {projects.map((project, index) => (
          <div key={index} className="border border-white p-2">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-white font-bold text-sm">{project.name}</h3>
              {project.progress === 100 && (
                <div className="border border-white px-1 text-xs bg-white text-black">DONE</div>
              )}
            </div>
            <p className="text-white text-xs mb-2">{project.description}</p>
            <div className="w-full h-4 border border-white flex">
              <div className="h-full bg-pattern-checker" style={{ width: `${project.progress}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </Window>
  )
}

