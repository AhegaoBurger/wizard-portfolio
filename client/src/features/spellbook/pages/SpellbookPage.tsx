import { useState } from 'react'
import { motion } from 'framer-motion'
import Window from '@/shared/components/layout/window'
import PageShell from '@/shared/components/layout/page-shell'
import LoadingScreen from '@/shared/components/layout/loading-screen'
import MobileLayout from '@/shared/components/layout/mobile-layout'
import { useIsMobile } from '@/shared/hooks/use-mobile'
import { useSkillTree } from '@/features/spellbook/api/spellbook.hooks'
import SkillTree from '@/features/spellbook/components/skill-tree'
import SkillDetails from '@/features/spellbook/components/skill-details'
import type { SkillNode } from '@shared/types'

export default function SpellbookPage() {
  const isMobile = useIsMobile()
  const { nodes, connections, branches, loading } = useSkillTree()
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null)

  if (loading) {
    return <LoadingScreen />
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
    <PageShell>
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
    </PageShell>
  )
}
