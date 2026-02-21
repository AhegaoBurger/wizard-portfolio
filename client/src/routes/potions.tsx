import { createFileRoute } from '@tanstack/react-router'
import { PotionsPage } from '@/features/potions'

export const Route = createFileRoute('/potions')({
  component: PotionsPage,
})
