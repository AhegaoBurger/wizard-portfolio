import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/potions')({
  beforeLoad: () => {
    throw redirect({ to: '/spells' })
  },
})
