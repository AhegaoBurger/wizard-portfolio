import type { PageDefinition } from '../types'
import { DataProvider } from './data-context'
import { NodeRenderer } from './node-renderer'
import { registerDefaults } from '../registry/register-defaults'

interface PageRendererProps {
  page: PageDefinition
}

// Ensure defaults are registered
registerDefaults()

export function PageRenderer({ page }: PageRendererProps) {
  const data = page.data as Record<string, unknown>

  return (
    <DataProvider rootData={data} scopedData={data}>
      <NodeRenderer
        node={page.layout}
        data={data}
        rootData={data}
      />
    </DataProvider>
  )
}
