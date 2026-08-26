import { createFileRoute } from '@tanstack/react-router'
import { DesktopPage } from '@/features/wizard-os/pages/desktop'

export const Route = createFileRoute('/')({
  component: DesktopPage,
})
