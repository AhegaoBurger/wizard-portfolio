import { createFileRoute } from '@tanstack/react-router'
import { GrimoirePage } from '@/features/wizard-os/pages/site-pages'
import { useOS } from '@/features/wizard-os/shell/os-context'

export const Route = createFileRoute('/grimoire/')({
  component: Grimoire,
})

function Grimoire() {
  const os = useOS()
  return <GrimoirePage accent={os.accent} />
}
