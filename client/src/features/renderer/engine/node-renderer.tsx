import type { LayoutNode } from '../types'
import { getComponent } from '../registry/component-registry'
import { resolveField } from './data-context'
import { BehaviorWrapper } from './behavior-wrapper'

interface NodeRendererProps {
  node: LayoutNode
  data: Record<string, unknown>
  rootData: Record<string, unknown>
}

export function NodeRenderer({ node, data, rootData }: NodeRendererProps) {
  const entry = getComponent(node.type)

  if (!entry) {
    if (process.env.NODE_ENV === 'development') {
      return (
        <div className="border border-red-500 p-1 text-red-500 text-xs">
          Unknown component: {node.type}
        </div>
      )
    }
    return null
  }

  // Resolve data binding
  let resolvedData: unknown = data

  if (node.field) {
    // Field binding - resolve from current data scope
    resolvedData = resolveField(data, node.field) ?? resolveField(rootData, node.field)
  } else if (node.bind) {
    // Container binding - resolve array/object from root data
    resolvedData = resolveField(data, node.bind) ?? resolveField(rootData, node.bind)
  }

  // Render children
  const children = node.children?.map((childNode, index) => {
    // If parent has a bind, children resolve from the bound data scope
    const childData = node.bind && typeof resolvedData === 'object' && resolvedData !== null
      ? resolvedData as Record<string, unknown>
      : data

    return (
      <NodeRenderer
        key={index}
        node={childNode}
        data={childData}
        rootData={rootData}
      />
    )
  })

  const Component = entry.component

  const rendered = (
    <Component node={node} data={resolvedData}>
      {children}
    </Component>
  )

  // Wrap with behavior if specified
  if (node.behaviors && node.behaviors.length > 0) {
    return (
      <BehaviorWrapper behaviors={node.behaviors}>
        {rendered}
      </BehaviorWrapper>
    )
  }

  return rendered
}
