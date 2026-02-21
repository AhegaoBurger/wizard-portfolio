import { createFileRoute } from '@tanstack/react-router'
import { SpellbookPage } from '@/features/spellbook'

export const Route = createFileRoute('/spells')({
  component: SpellbookPage,
})
