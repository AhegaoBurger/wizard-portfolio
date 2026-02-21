import { useQuery } from '@tanstack/react-query'
import { queryOptions } from '@tanstack/react-query'
import { fetchAPI } from '@/shared/lib/api-client'
import Window from '@/shared/components/layout/window'
import type { ProjectsData } from '@shared/types'

const projectsQueryOptions = queryOptions({
  queryKey: ['projects'],
  queryFn: () => fetchAPI<ProjectsData>('/content/projects'),
  select: (data) => data.projects.slice(0, 3),
})

export default function ProjectsWindow() {
  const { data: projects } = useQuery(projectsQueryOptions)

  const displayProjects = projects ?? [
    { name: 'Trading_Dashboard', description: 'Real-time trading platform', type: 'Systems', completion: 100 },
    { name: 'Canister_Cloud', description: 'E2E encrypted storage', type: 'Security', completion: 100 },
    { name: 'Portfolio_Analytics', description: 'Cross-exchange analytics', type: 'Data Engineering', completion: 90 },
  ]

  return (
    <Window
      title="Grimoire"
      width="w-72"
      height="h-auto"
      x="left-4"
      y="top-[22rem]"
    >
      <div className="flex flex-col gap-3">
        {displayProjects.map((project, index) => (
          <div key={index} className="border border-white p-2">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-white font-bold text-sm glow-text">{project.name}</h3>
              {project.completion === 100 && (
                <div className="border border-white px-1 text-xs bg-white text-black">
                  DONE
                </div>
              )}
            </div>
            <p className="text-white text-xs mb-1">{project.type}</p>
            <p className="text-white text-xs mb-2 text-white/60">{project.description}</p>
            <div className="w-full h-4 border border-white flex">
              <div
                className="h-full bg-pattern-checker"
                style={{ width: `${project.completion}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </Window>
  )
}
