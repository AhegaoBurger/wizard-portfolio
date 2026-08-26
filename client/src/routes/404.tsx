import { createFileRoute } from '@tanstack/react-router'
import { DuelPage } from '@/features/wizard-os/pages/site-pages'
import { useOS } from '@/features/wizard-os/shell/os-context'

export const Route = createFileRoute('/404')({
  component: Duel,
})

function Duel() {
  const os = useOS()
  return <DuelPage accent={os.accent} />
}
