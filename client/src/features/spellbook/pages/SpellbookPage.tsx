import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import Window from '@/shared/components/layout/window'
import Clock from '@/shared/components/navigation/clock'
import BackButton from '@/shared/components/navigation/back-button'
import ManaBar from '@/shared/components/navigation/mana-bar'
import MobileLayout from '@/shared/components/layout/mobile-layout'
import { useIsMobile } from '@/shared/hooks/use-mobile'
import { useSkillTree } from '@/features/spellbook/api/spellbook.hooks'
import SkillTree from '@/features/spellbook/components/skill-tree'
import SkillDetails from '@/features/spellbook/components/skill-details'
import type { SkillNode } from '@shared/types'

export default function SpellbookPage() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const { nodes, connections, branches, loading } = useSkillTree()
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null)
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

  if (isMobile) {
    const levelLabels = { mastered: 'Mastered', proficient: 'Proficient', learning: 'Learning', planned: 'Planned' }
    const branchGroups = new Map<string, typeof nodes>()
    for (const node of nodes) {
      const group = branchGroups.get(node.branch) ?? []
      group.push(node)
      branchGroups.set(node.branch, group)
    }

    const treeListContent = (
      <div className="flex flex-col gap-2">
        <div className="border border-white p-2 mb-2">
          <h2 className="text-heading text-center mb-2">SKILL TREE</h2>
          <p className="text-white text-xs text-center">Tap a skill to view details</p>
        </div>
        {Array.from(branchGroups.entries()).map(([branch, branchNodes]) => (
          <div key={branch} className="mb-2">
            <div className="text-white/50 text-xs font-bold mb-1 px-1">{branch}</div>
            {branchNodes.map((node) => (
              <motion.div
                key={node.id}
                className={`p-2 mb-1 border border-white ${selectedNode?.id === node.id ? 'bg-white text-black' : 'text-white'}`}
                onClick={() => setSelectedNode(node)}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">{node.name}</span>
                  <span className="text-xs">{levelLabels[node.level]}</span>
                </div>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    )

    const detailsContent = selectedNode ? (
      <div className="p-2">
        <SkillDetails node={selectedNode} connections={connections} allNodes={nodes} />
      </div>
    ) : (
      <div className="flex items-center justify-center h-full">
        <p className="text-white text-center">Select a skill to view details</p>
      </div>
    )

    const windows = [
      { id: 'tree', title: 'Skill_Tree', icon: 'T', content: treeListContent },
      { id: 'details', title: 'Skill_Details', icon: 'D', content: detailsContent },
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
            <Window
              title="Spellbook_—_Skill_Tree"
              width="w-[calc(100%-2rem)]"
              height="h-[calc(100vh-6rem)]"
              x="left-4"
              y="top-4"
            >
              <SkillTree nodes={nodes} connections={connections} branches={branches} />
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
