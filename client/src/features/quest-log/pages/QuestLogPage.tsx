import { useState } from 'react'
import { motion } from 'framer-motion'
import Window from '@/shared/components/layout/window'
import PageShell from '@/shared/components/layout/page-shell'
import LoadingScreen from '@/shared/components/layout/loading-screen'
import MobileLayout from '@/shared/components/layout/mobile-layout'
import { useIsMobile } from '@/shared/hooks/use-mobile'
import { useQuestLog } from '@/features/quest-log/api/quest-log.hooks'
import type { ActiveQuest, CompletedQuest } from '@shared/types'

type SelectedQuest =
  | { type: 'active'; quest: ActiveQuest }
  | { type: 'completed'; quest: CompletedQuest }

export default function QuestLogPage() {
  const isMobile = useIsMobile()
  const { activeQuests, completedQuests, loading } = useQuestLog()
  const [selected, setSelected] = useState<SelectedQuest | null>(null)

  if (loading) {
    return <LoadingScreen />
  }

  const questListContent = (
    <div className="flex flex-col gap-2">
      <div className="border border-white p-2 mb-2">
        <h2 className="text-heading text-center mb-2">QUEST LOG</h2>
        <p className="text-white text-xs text-center">Your journey through the tech realm</p>
      </div>

      {activeQuests.length > 0 && (
        <>
          <div className="text-white/50 text-xs font-bold px-1">ACTIVE QUESTS</div>
          {activeQuests.map((quest) => (
            <motion.div
              key={quest.id}
              className={`p-2 border border-white cursor-pointer ${
                selected?.quest.id === quest.id ? 'bg-white text-black' : 'text-white'
              }`}
              onClick={() => setSelected({ type: 'active', quest })}
              whileHover={isMobile ? undefined : { scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-sm">{quest.name}</span>
                <span className="text-xs animate-pulse">{quest.progress}%</span>
              </div>
              <div className="w-full h-3 border border-current flex">
                <div
                  className={`h-full ${selected?.quest.id === quest.id ? 'bg-black' : 'bg-pattern-checker'}`}
                  style={{ width: `${quest.progress}%` }}
                />
              </div>
            </motion.div>
          ))}
        </>
      )}

      {completedQuests.length > 0 && (
        <>
          <div className="text-white/50 text-xs font-bold px-1 mt-2">COMPLETED QUESTS</div>
          {completedQuests.map((quest) => (
            <motion.div
              key={quest.id}
              className={`p-2 border border-white cursor-pointer ${
                selected?.quest.id === quest.id ? 'bg-white text-black' : 'text-white'
              }`}
              onClick={() => setSelected({ type: 'completed', quest })}
              whileHover={isMobile ? undefined : { scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm">{quest.name}</span>
                <div className="border border-current px-1 text-xs">DONE</div>
              </div>
              <span className="text-xs">{quest.period}</span>
            </motion.div>
          ))}
        </>
      )}
    </div>
  )

  const questDetailsContent = selected ? (
    <motion.div
      key={selected.quest.id}
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-2"
    >
      <div className="border border-white p-2 mb-3">
        <h3 className="text-white font-bold text-sm glow-text mb-1">{selected.quest.name}</h3>
        {selected.type === 'active' && (
          <span className="text-white text-xs">Started: {selected.quest.startDate}</span>
        )}
        {selected.type === 'completed' && (
          <span className="text-white text-xs">Period: {selected.quest.period}</span>
        )}
      </div>

      <div className="border border-white p-2 mb-3">
        <div className="text-white text-xs font-bold mb-1">Description:</div>
        <p className="text-white text-xs leading-relaxed">{selected.quest.description}</p>
      </div>

      {selected.type === 'active' && (
        <>
          <div className="border border-white p-2 mb-3">
            <div className="text-white text-xs font-bold mb-1">Progress:</div>
            <div className="w-full h-4 border border-white flex mb-1">
              <div
                className="h-full bg-pattern-checker"
                style={{ width: `${selected.quest.progress}%` }}
              />
            </div>
            <div className="text-white text-xs text-right">{selected.quest.progress}%</div>
          </div>

          <div className="border border-white p-2">
            <div className="text-white text-xs font-bold mb-1">Objectives:</div>
            {selected.quest.objectives.map((obj, i) => (
              <div key={i} className="flex items-start mb-1 last:mb-0">
                <div className="w-3 h-3 border border-white mr-2 mt-px" />
                <span className="text-white text-xs">{obj}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {selected.type === 'completed' && (
        <div className="border border-white p-2">
          <div className="text-white text-xs font-bold mb-1">Achievements:</div>
          {selected.quest.achievements.map((ach, i) => (
            <div key={i} className="flex items-start mb-1 last:mb-0">
              <div className="w-3 h-3 bg-white mr-2 mt-px" />
              <span className="text-white text-xs">{ach}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  ) : (
    <div className="flex items-center justify-center h-full">
      <p className="text-white text-center">Select a quest to view details</p>
    </div>
  )

  if (isMobile) {
    const windows = [
      { id: 'quests', title: 'Quest_Log', icon: 'Q', content: questListContent },
      { id: 'details', title: 'Quest_Details', icon: 'D', content: questDetailsContent },
    ]
    return <MobileLayout windows={windows} />
  }

  return (
    <PageShell>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <Window title="Quest_Log" width="w-80" height="h-96" x="left-4" y="top-4">
          <div className="h-full overflow-auto">
            {questListContent}
          </div>
        </Window>
      </motion.div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <Window title="Quest_Details" width="w-80" height="h-auto" x="right-4" y="top-4">
          {questDetailsContent}
        </Window>
      </motion.div>
    </PageShell>
  )
}
