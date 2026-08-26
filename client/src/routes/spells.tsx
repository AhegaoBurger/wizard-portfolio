import { createFileRoute } from '@tanstack/react-router'
import { SpellsPage } from '@/features/wizard-os/pages/site-pages'
import { useOS } from '@/features/wizard-os/shell/os-context'

export const Route = createFileRoute('/spells')({
  component: Spells,
})

function Spells() {
  const os = useOS()
  return <SpellsPage accent={os.accent} />
}
