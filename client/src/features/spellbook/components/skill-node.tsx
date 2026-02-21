import { motion } from 'framer-motion'
import { cn } from '@/shared/utils'
import type { SkillNode as SkillNodeType } from '@shared/types'

interface SkillNodeProps {
  node: SkillNodeType
  selected: boolean
  highlighted: boolean
  dimmed: boolean
  onClick: (node: SkillNodeType) => void
  index: number
}

const levelStyles = {
  mastered: 'bg-white text-black glow-strong',
  proficient: 'bg-white/80 text-black',
  learning: 'border-white bg-black text-white animate-pulse',
  planned: 'border-white/40 bg-black text-white/40',
}

export default function SkillNode({ node, selected, highlighted, dimmed, onClick, index }: SkillNodeProps) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.1 + index * 0.04, duration: 0.3 }}
      className={cn(
        'absolute px-2 py-1 border text-xs font-pixel cursor-pointer z-10 whitespace-nowrap',
        levelStyles[node.level],
        selected && 'ring-2 ring-white ring-offset-1 ring-offset-black',
        dimmed && !highlighted && 'opacity-20',
        highlighted && 'opacity-100',
      )}
      style={{
        left: `${node.x}%`,
        top: `${node.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      onClick={() => onClick(node)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {node.name}
    </motion.button>
  )
}
