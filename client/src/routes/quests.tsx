import { createFileRoute } from '@tanstack/react-router'
import { QuestLogPage } from '@/features/quest-log'

export const Route = createFileRoute('/quests')({
  component: QuestLogPage,
})
