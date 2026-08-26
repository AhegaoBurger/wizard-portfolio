import { createFileRoute } from '@tanstack/react-router'
import { WizardRoom } from '@/features/wizard-os/art/pixel-room'
import { useOS } from '@/features/wizard-os/shell/os-context'

export const Route = createFileRoute('/laboratory')({
  component: Laboratory,
})

// The explorable rooms are full-bleed: the shell skips its scroll container
// for this route so the canvas can size itself to the frame.
function Laboratory() {
  const os = useOS()
  return <WizardRoom accent={os.accent} embedded onNavigate={os.navigate} initialRoom="study" />
}
