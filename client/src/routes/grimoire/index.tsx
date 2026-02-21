import { createFileRoute } from '@tanstack/react-router'
import { GrimoirePage } from '@/features/grimoire'

export const Route = createFileRoute('/grimoire/')({
  component: GrimoirePage,
})
