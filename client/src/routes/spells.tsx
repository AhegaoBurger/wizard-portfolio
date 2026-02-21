import { createFileRoute } from '@tanstack/react-router'
import { SpellsPage } from '@/features/spells'

export const Route = createFileRoute('/spells')({
  component: SpellsPage,
})
