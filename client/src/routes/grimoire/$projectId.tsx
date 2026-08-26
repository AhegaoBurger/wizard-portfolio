import { createFileRoute, notFound } from '@tanstack/react-router'
import { ProjectPage } from '@/features/wizard-os/pages/site-pages'
import { useOS } from '@/features/wizard-os/shell/os-context'
import { PROJECTS } from '@/features/wizard-os/data/site-data'

export const Route = createFileRoute('/grimoire/$projectId')({
  // Resolve at load time so an unknown id renders the 404 duel rather than
  // silently falling back to the first project.
  loader: ({ params }) => {
    const project = PROJECTS.find((p) => p.id === params.projectId)
    if (!project) throw notFound()
    return { project }
  },
  component: Project,
})

function Project() {
  const os = useOS()
  const { project } = Route.useLoaderData()
  return <ProjectPage project={project} accent={os.accent} />
}
