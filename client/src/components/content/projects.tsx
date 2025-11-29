import { cn } from "@/lib/utils"

type Project = {
  title: string
  description: string
  completion: number
  featured: boolean
  link: string
}

const projects: Project[] = [
  {
    title: "ENCHANTED DASHBOARD",
    description: "A magical dashboard for monitoring spell effectiveness",
    completion: 100,
    featured: true,
    link: "#",
  },
  {
    title: "POTION TRACKER",
    description: "Track brewing status of your magical concoctions",
    completion: 85,
    featured: false,
    link: "#",
  },
  {
    title: "SPELL COMPILER",
    description: "Convert ancient runes to modern JavaScript",
    completion: 70,
    featured: true,
    link: "#",
  },
  {
    title: "FAMILIAR FINDER",
    description: "Match wizards with their perfect animal companions",
    completion: 100,
    featured: false,
    link: "#",
  },
]

export default function Projects() {
  return (
    <section id="grimoire" className="py-16 px-4 bg-black">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 pixel-text text-center">MAGICAL GRIMOIRE</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="spell-tome border-2 border-white p-4 relative">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold">{project.title}</h3>
        {project.featured && (
          <div className="pixel-bonus-label bg-electric-blue text-black px-2 py-1 text-xs">BONUS</div>
        )}
      </div>

      <p className="mb-4 text-sm">{project.description}</p>

      <div className="mb-4">
        <div className="text-xs mb-1">COMPLETION</div>
        <div className="pixel-progress-bar h-4 w-full border border-white">
          <div
            className={cn("h-full bg-checkered", project.completion === 100 ? "bg-electric-blue" : "bg-white")}
            style={{ width: `${project.completion}%` }}
          ></div>
        </div>
        <div className="text-right text-xs mt-1">{project.completion}%</div>
      </div>

      <a href={project.link} className="pixel-button inline-block px-4 py-2 text-sm">
        CAST SPELL
      </a>
    </div>
  )
}

