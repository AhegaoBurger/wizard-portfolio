import { useState, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import SkillNodeComponent from './skill-node'
import SkillDetails from './skill-details'
import type { SkillNode, SkillConnection, BranchLabel } from '@shared/types'

interface SkillTreeProps {
  nodes: SkillNode[]
  connections: SkillConnection[]
  branches: BranchLabel[]
}

function buildAncestorSet(nodeId: string, connections: SkillConnection[]): Set<string> {
  const ancestors = new Set<string>()
  const queue = [nodeId]
  ancestors.add(nodeId)

  while (queue.length > 0) {
    const current = queue.shift()!
    for (const conn of connections) {
      if (conn.to === current && !ancestors.has(conn.from)) {
        ancestors.add(conn.from)
        queue.push(conn.from)
      }
    }
  }
  return ancestors
}

function getConnectionPath(from: SkillNode, to: SkillNode): string {
  const midY = (from.y + to.y) / 2
  return `M ${from.x} ${from.y} L ${from.x} ${midY} L ${to.x} ${midY} L ${to.x} ${to.y}`
}

export default function SkillTree({ nodes, connections, branches }: SkillTreeProps) {
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null)

  const nodeLookup = useMemo(
    () => new Map(nodes.map(n => [n.id, n])),
    [nodes]
  )

  const highlightedIds = useMemo(() => {
    if (!selectedNode) return null
    return buildAncestorSet(selectedNode.id, connections)
  }, [selectedNode, connections])

  const handleNodeClick = useCallback((node: SkillNode) => {
    setSelectedNode(prev => prev?.id === node.id ? null : node)
  }, [])

  return (
    <div className="flex gap-4 h-full">
      <div className="flex-1 relative border border-white overflow-hidden" style={{ minHeight: '500px' }}>
        {/* Branch labels */}
        {branches.map((branch) => (
          <div
            key={branch.name}
            className="absolute text-white/30 text-xs font-pixel z-0"
            style={{ left: `${branch.x}%`, top: `${branch.y}%` }}
          >
            {branch.name}
          </div>
        ))}

        {/* SVG connection lines */}
        <svg
          className="absolute inset-0 w-full h-full z-0"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {connections.map((conn) => {
            const fromNode = nodeLookup.get(conn.from)
            const toNode = nodeLookup.get(conn.to)
            if (!fromNode || !toNode) return null

            const isHighlighted = highlightedIds
              && highlightedIds.has(conn.from)
              && highlightedIds.has(conn.to)

            return (
              <path
                key={`${conn.from}-${conn.to}`}
                d={getConnectionPath(fromNode, toNode)}
                fill="none"
                stroke={isHighlighted ? 'white' : 'rgba(255,255,255,0.2)'}
                strokeWidth="0.5"
                strokeDasharray={conn.dashed ? '2,2' : undefined}
                vectorEffect="non-scaling-stroke"
                className="transition-all duration-300"
              />
            )
          })}
        </svg>

        {/* Skill nodes */}
        {nodes.map((node, index) => (
          <SkillNodeComponent
            key={node.id}
            node={node}
            selected={selectedNode?.id === node.id}
            highlighted={highlightedIds?.has(node.id) ?? false}
            dimmed={highlightedIds !== null}
            onClick={handleNodeClick}
            index={index}
          />
        ))}

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-2 right-2 border border-white/30 p-2 bg-black/80 z-20"
        >
          <div className="text-white text-xs font-bold mb-1">Legend</div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-white glow-strong" />
            <span className="text-white text-xs">Mastered</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-white/80" />
            <span className="text-white text-xs">Proficient</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 border border-white animate-pulse" />
            <span className="text-white text-xs">Learning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border border-white/40" />
            <span className="text-white text-xs">Planned</span>
          </div>
        </motion.div>
      </div>

      {/* Details panel (desktop only) */}
      <div className="w-64 flex-shrink-0 hidden lg:block">
        {selectedNode ? (
          <SkillDetails
            key={selectedNode.id}
            node={selectedNode}
            connections={connections}
            allNodes={nodes}
          />
        ) : (
          <div className="border border-white p-4 text-center">
            <p className="text-white text-xs">Click a skill node to view details</p>
          </div>
        )}
      </div>
    </div>
  )
}
