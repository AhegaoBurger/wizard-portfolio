import { createFileRoute } from '@tanstack/react-router'
import { ContactPage } from '@/features/wizard-os/pages/site-pages'
import { useOS } from '@/features/wizard-os/shell/os-context'

export const Route = createFileRoute('/contact')({
  component: Contact,
})

function Contact() {
  const os = useOS()
  return <ContactPage accent={os.accent} />
}
