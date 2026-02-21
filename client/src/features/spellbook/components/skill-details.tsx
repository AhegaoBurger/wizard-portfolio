import { motion } from 'framer-motion'
import type { SkillNode, SkillConnection } from '@shared/types'

interface SkillDetailsProps {
  node: SkillNode
  connections: SkillConnection[]
  allNodes: SkillNode[]
}

const levelLabels = {
  mastered: 'Mastered',
  proficient: 'Proficient',
  learning: 'Learning',
  planned: 'Planned',
}

const levelWidth = {
  mastered: '100%',
  proficient: '75%',
  learning: '40%',
  planned: '10%',
}

export default function SkillDetails({ node, connections, allNodes }: SkillDetailsProps) {
  const nodeLookup = new Map(allNodes.map(n => [n.id, n]))

  const parents = connections
    .filter(c => c.to === node.id)
    .map(c => nodeLookup.get(c.from))
    .filter(Boolean) as SkillNode[]

  const children = connections
    .filter(c => c.from === node.id)
    .map(c => nodeLookup.get(c.to))
    .filter(Boolean) as SkillNode[]

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-3"
    >
      <div className="border border-white p-2">
        <h3 className="text-white font-bold text-sm glow-text mb-2">{node.name}</h3>
        <div className="flex justify-between items-center mb-2">
          <span className="text-white text-xs">Level:</span>
          <span className="text-white text-xs">{levelLabels[node.level]}</span>
        </div>
        <div className="w-full h-3 border border-white">
          <div
            className="h-full bg-pattern-checker"
            style={{ width: levelWidth[node.level] }}
          />
        </div>
      </div>

      <div className="border border-white p-2">
        <div className="flex justify-between mb-1">
          <span className="text-white text-xs font-bold">Branch:</span>
          <span className="text-white text-xs">{node.branch}</span>
        </div>
      </div>

      <div className="border border-white p-2">
        <div className="text-white text-xs font-bold mb-1">Description:</div>
        <p className="text-white text-xs leading-relaxed">{node.description}</p>
      </div>

      {parents.length > 0 && (
        <div className="border border-white p-2">
          <div className="text-white text-xs font-bold mb-1">Prerequisites:</div>
          {parents.map(p => (
            <div key={p.id} className="text-white text-xs mb-1 flex items-center gap-1">
              <div className="w-2 h-2 bg-white" />
              {p.name}
            </div>
          ))}
        </div>
      )}

      {children.length > 0 && (
        <div className="border border-white p-2">
          <div className="text-white text-xs font-bold mb-1">Unlocks:</div>
          {children.map(c => (
            <div key={c.id} className="text-white text-xs mb-1 flex items-center gap-1">
              <div className="w-2 h-2 border border-white" />
              {c.name}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
