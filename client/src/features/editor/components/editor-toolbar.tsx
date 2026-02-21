import { motion } from 'framer-motion'

interface EditorToolbarProps {
  pageId: string | null
  isSaving: boolean
  hasChanges: boolean
  validationError: string | null
  onSave: () => void
  onRevert: () => void
}

export function EditorToolbar({
  pageId,
  isSaving,
  hasChanges,
  validationError,
  onSave,
  onRevert,
}: EditorToolbarProps) {
  return (
    <div className="border-b border-white bg-black px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="text-white font-bold text-sm">
          {pageId ? `Editing: ${pageId}` : 'Page Editor'}
        </span>
        {hasChanges && (
          <span className="text-white text-xs border border-white px-1">UNSAVED</span>
        )}
        {validationError && (
          <span className="text-white text-xs border border-white px-1 bg-white text-black">ERROR</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <motion.button
          className="border border-white px-3 py-1 text-white text-xs"
          onClick={onRevert}
          disabled={!hasChanges}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ opacity: hasChanges ? 1 : 0.5 }}
        >
          REVERT
        </motion.button>
        <motion.button
          className="border border-white px-3 py-1 bg-white text-black text-xs"
          onClick={onSave}
          disabled={isSaving || !!validationError}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ opacity: isSaving || validationError ? 0.5 : 1 }}
        >
          {isSaving ? 'SAVING...' : 'SAVE'}
        </motion.button>
      </div>
    </div>
  )
}
