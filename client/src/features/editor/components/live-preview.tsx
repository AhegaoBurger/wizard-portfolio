import { PageRenderer } from '@/features/renderer'
import type { PageDefinition } from '@/features/renderer/types'

interface LivePreviewProps {
  page: PageDefinition | null
  error: string | null
}

export function LivePreview({ page, error }: LivePreviewProps) {
  if (error) {
    return (
      <div className="h-full border border-white bg-black p-4">
        <div className="text-white font-bold mb-2">VALIDATION ERROR</div>
        <pre className="text-white text-xs whitespace-pre-wrap opacity-70">{error}</pre>
      </div>
    )
  }

  if (!page) {
    return (
      <div className="h-full border border-white bg-black flex items-center justify-center">
        <div className="text-white text-xs">No page loaded</div>
      </div>
    )
  }

  return (
    <div className="h-full border border-white bg-black overflow-auto">
      <div className="transform scale-75 origin-top-left" style={{ width: '133%' }}>
        <PageRenderer page={page} />
      </div>
    </div>
  )
}
