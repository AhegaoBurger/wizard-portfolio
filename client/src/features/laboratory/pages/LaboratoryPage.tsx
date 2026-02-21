import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import Window from '@/shared/components/layout/window'
import Clock from '@/shared/components/navigation/clock'
import BackButton from '@/shared/components/navigation/back-button'
import ManaBar from '@/shared/components/navigation/mana-bar'
import MobileLayout from '@/shared/components/layout/mobile-layout'
import { useIsMobile } from '@/shared/hooks/use-mobile'
import { useLaboratory } from '@/features/laboratory/api/laboratory.hooks'
import type { Experiment, Study } from '@shared/types'

type SelectedItem =
  | { type: 'experiment'; item: Experiment }
  | { type: 'study'; item: Study }

const statusLabels = {
  'in-progress': 'IN PROGRESS',
  'completed': 'COMPLETE',
  'planned': 'PLANNED',
}

const studyTypeLabels = {
  course: 'Course',
  paper: 'Paper',
  book: 'Book',
  tutorial: 'Tutorial',
}

export default function LaboratoryPage() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const { experiments, studies, loading } = useLaboratory()
  const [selected, setSelected] = useState<SelectedItem | null>(null)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [isClicking, setIsClicking] = useState(false)

  useEffect(() => {
    if (isMobile) return
    const handleMouseMove = (e: MouseEvent) => setCursorPosition({ x: e.clientX, y: e.clientY })
    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isMobile])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white font-pixel flex items-center justify-center">
        <div className="text-xl glow-text animate-flicker">Loading...</div>
      </div>
    )
  }

  const selectedId = selected?.item.id ?? null

  const listContent = (
    <div className="flex flex-col gap-2">
      <div className="border border-white p-2 mb-2">
        <h2 className="text-heading text-center mb-2">LABORATORY</h2>
        <p className="text-white text-xs text-center">Experiments and studies in progress</p>
      </div>

      {experiments.length > 0 && (
        <>
          <div className="text-white/50 text-xs font-bold px-1">EXPERIMENTS</div>
          {experiments.map((exp) => (
            <motion.div
              key={exp.id}
              className={`p-2 border border-white cursor-pointer ${
                selectedId === exp.id ? 'bg-white text-black' : 'text-white'
              }`}
              onClick={() => setSelected({ type: 'experiment', item: exp })}
              whileHover={isMobile ? undefined : { scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-sm">{exp.name}</span>
                <span className={`text-xs ${exp.status === 'in-progress' ? 'animate-pulse' : ''}`}>
                  {statusLabels[exp.status]}
                </span>
              </div>
              <div className="w-full h-3 border border-current flex">
                <div
                  className={`h-full ${selectedId === exp.id ? 'bg-black' : 'bg-pattern-checker'}`}
                  style={{ width: `${exp.progress}%` }}
                />
              </div>
            </motion.div>
          ))}
        </>
      )}

      {studies.length > 0 && (
        <>
          <div className="text-white/50 text-xs font-bold px-1 mt-2">STUDIES</div>
          {studies.map((study) => (
            <motion.div
              key={study.id}
              className={`p-2 border border-white cursor-pointer ${
                selectedId === study.id ? 'bg-white text-black' : 'text-white'
              }`}
              onClick={() => setSelected({ type: 'study', item: study })}
              whileHover={isMobile ? undefined : { scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-sm">{study.name}</span>
                <span className="text-xs">{studyTypeLabels[study.type]}</span>
              </div>
              <div className="w-full h-3 border border-current flex">
                <div
                  className={`h-full ${selectedId === study.id ? 'bg-black' : 'bg-pattern-checker'}`}
                  style={{ width: `${study.progress}%` }}
                />
              </div>
            </motion.div>
          ))}
        </>
      )}
    </div>
  )

  const detailsContent = selected ? (
    <motion.div
      key={selected.item.id}
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-2"
    >
      <div className="border border-white p-2 mb-3">
        <h3 className="text-white font-bold text-sm glow-text mb-1">{selected.item.name}</h3>
        <span className="text-white text-xs">{statusLabels[selected.item.status]}</span>
      </div>

      {selected.type === 'experiment' && (
        <>
          <div className="border border-white p-2 mb-3">
            <div className="text-white text-xs font-bold mb-1">Description:</div>
            <p className="text-white text-xs leading-relaxed">{selected.item.description}</p>
          </div>

          <div className="border border-white p-2 mb-3">
            <div className="text-white text-xs font-bold mb-1">Progress:</div>
            <div className="w-full h-4 border border-white flex mb-1">
              <div
                className="h-full bg-pattern-checker"
                style={{ width: `${selected.item.progress}%` }}
              />
            </div>
            <div className="text-white text-xs text-right">{selected.item.progress}%</div>
          </div>

          {selected.item.tech.length > 0 && (
            <div className="border border-white p-2">
              <div className="text-white text-xs font-bold mb-1">Tech Stack:</div>
              <div className="flex flex-wrap gap-1">
                {selected.item.tech.map((t) => (
                  <span key={t} className="border border-white/50 px-1 text-xs text-white/80">{t}</span>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {selected.type === 'study' && (
        <>
          <div className="border border-white p-2 mb-3">
            <div className="flex justify-between">
              <span className="text-white text-xs font-bold">Type:</span>
              <span className="text-white text-xs">{studyTypeLabels[selected.item.type]}</span>
            </div>
          </div>

          <div className="border border-white p-2">
            <div className="text-white text-xs font-bold mb-1">Progress:</div>
            <div className="w-full h-4 border border-white flex mb-1">
              <div
                className="h-full bg-pattern-checker"
                style={{ width: `${selected.item.progress}%` }}
              />
            </div>
            <div className="text-white text-xs text-right">{selected.item.progress}%</div>
          </div>
        </>
      )}
    </motion.div>
  ) : (
    <div className="flex items-center justify-center h-full">
      <p className="text-white text-center">Select an item to view details</p>
    </div>
  )

  if (isMobile) {
    const windows = [
      { id: 'lab', title: 'Laboratory', icon: 'L', content: listContent },
      { id: 'details', title: 'Lab_Details', icon: 'D', content: detailsContent },
    ]
    return <MobileLayout windows={windows} />
  }

  return (
    <div className="min-h-screen bg-black p-4 font-pixel overflow-hidden relative">
      <ManaBar />
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Window title="Laboratory" width="w-80" height="h-96" x="left-4" y="top-4">
              <div className="h-full overflow-auto">
                {listContent}
              </div>
            </Window>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <Window title="Lab_Details" width="w-80" height="h-auto" x="right-4" y="top-4">
              {detailsContent}
            </Window>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="fixed bottom-4 right-4"
          >
            <BackButton onClickAction={() => navigate({ to: '/' })} />
          </motion.div>

          <Clock />

          <div
            className="fixed pointer-events-none z-50"
            style={{
              left: `${cursorPosition.x}px`,
              top: `${cursorPosition.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className={`w-4 h-4 border border-white ${isClicking ? 'bg-white' : ''}`} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
