import { useState, useEffect, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { pageQueryOptions } from '../api/editor.queries'
import { updatePage } from '../api/editor.service'
import { pageDefinitionSchema } from '@/features/renderer/schemas/page-definition.schema'
import { JsonEditor } from '../components/json-editor'
import { LivePreview } from '../components/live-preview'
import { EditorToolbar } from '../components/editor-toolbar'
import type { PageDefinition } from '@/features/renderer/types'

interface EditorPageProps {
  pageId: string
}

export default function EditorPage({ pageId }: EditorPageProps) {
  const queryClient = useQueryClient()
  const { data: serverPage, isLoading } = useQuery(pageQueryOptions(pageId))

  const [jsonText, setJsonText] = useState('')
  const [parsedPage, setParsedPage] = useState<PageDefinition | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [token, setToken] = useState(() => localStorage.getItem('editor-token') || '')
  const [showTokenInput, setShowTokenInput] = useState(false)

  // Initialize editor content when server data loads
  useEffect(() => {
    if (serverPage) {
      const text = JSON.stringify(serverPage, null, 2)
      setJsonText(text)
      setParsedPage(serverPage)
      setHasChanges(false)
      setValidationError(null)
    }
  }, [serverPage])

  // Parse and validate on change
  const handleJsonChange = useCallback((value: string) => {
    setJsonText(value)
    setHasChanges(true)

    try {
      const parsed = JSON.parse(value)
      const result = pageDefinitionSchema.safeParse(parsed)

      if (result.success) {
        setParsedPage(parsed as PageDefinition)
        setValidationError(null)
      } else {
        setValidationError(result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('\n'))
      }
    } catch {
      setValidationError('Invalid JSON syntax')
    }
  }, [])

  const handleSave = async () => {
    if (!parsedPage || validationError) return

    if (!token) {
      setShowTokenInput(true)
      return
    }

    setIsSaving(true)
    try {
      await updatePage(pageId, parsedPage, token)
      localStorage.setItem('editor-token', token)
      setHasChanges(false)
      queryClient.invalidateQueries({ queryKey: ['editor'] })
    } catch (err) {
      setValidationError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setIsSaving(false)
    }
  }

  const handleRevert = () => {
    if (serverPage) {
      const text = JSON.stringify(serverPage, null, 2)
      setJsonText(text)
      setParsedPage(serverPage)
      setHasChanges(false)
      setValidationError(null)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black font-pixel flex items-center justify-center">
        <div className="text-white text-xl">Loading page...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black font-pixel flex flex-col">
      <EditorToolbar
        pageId={pageId}
        isSaving={isSaving}
        hasChanges={hasChanges}
        validationError={validationError}
        onSave={handleSave}
        onRevert={handleRevert}
      />

      {showTokenInput && (
        <div className="border-b border-white bg-black px-4 py-2 flex items-center gap-2">
          <span className="text-white text-xs">Editor Token:</span>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="bg-black border border-white text-white text-xs px-2 py-1 flex-1 max-w-xs"
            placeholder="Enter EDITOR_TOKEN"
          />
          <button
            className="border border-white px-2 py-1 text-white text-xs"
            onClick={() => {
              setShowTokenInput(false)
              handleSave()
            }}
          >
            OK
          </button>
        </div>
      )}

      <div className="flex-1 flex">
        {/* Code Editor (left half) */}
        <div className="w-1/2 flex flex-col">
          <div className="border-b border-white bg-black px-2 py-1">
            <span className="text-white text-xs font-bold">JSON DEFINITION</span>
          </div>
          <div className="flex-1">
            <JsonEditor value={jsonText} onChange={handleJsonChange} />
          </div>
        </div>

        {/* Live Preview (right half) */}
        <div className="w-1/2 flex flex-col border-l border-white">
          <div className="border-b border-white bg-black px-2 py-1">
            <span className="text-white text-xs font-bold">LIVE PREVIEW</span>
          </div>
          <div className="flex-1">
            <LivePreview page={parsedPage} error={validationError} />
          </div>
        </div>
      </div>
    </div>
  )
}
