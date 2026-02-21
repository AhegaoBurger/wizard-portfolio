import { createFileRoute } from '@tanstack/react-router'
import { EditorPage } from '@/features/editor'

export const Route = createFileRoute('/admin/editor/$pageId')({
  component: EditorRoute,
})

function EditorRoute() {
  const { pageId } = Route.useParams()
  return <EditorPage pageId={pageId} />
}
