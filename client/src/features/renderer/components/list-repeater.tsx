import type { RendererComponentProps, LayoutNode } from '../types'
import { NodeRenderer } from '../engine/node-renderer'

export function ListRepeater({ node, data }: RendererComponentProps) {
  const items = Array.isArray(data) ? data : []
  const itemLayout = node.itemLayout

  if (!itemLayout) {
    return (
      <div className="text-white text-xs">
        {items.map((item, index) => (
          <div key={index}>{String(item)}</div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, index) => (
        <NodeRenderer
          key={index}
          node={itemLayout}
          data={item as Record<string, unknown>}
          rootData={item as Record<string, unknown>}
        />
      ))}
    </div>
  )
}
