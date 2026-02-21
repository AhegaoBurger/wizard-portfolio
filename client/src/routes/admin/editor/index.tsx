import { createFileRoute } from '@tanstack/react-router'
import { PageSelector } from '@/features/editor'

export const Route = createFileRoute('/admin/editor/')({
  component: PageSelector,
})
