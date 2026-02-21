import Editor from '@monaco-editor/react'

interface JsonEditorProps {
  value: string
  onChange: (value: string) => void
}

export function JsonEditor({ value, onChange }: JsonEditorProps) {
  return (
    <div className="h-full border border-white">
      <Editor
        height="100%"
        defaultLanguage="json"
        value={value}
        onChange={(val) => onChange(val || '')}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily: 'monospace',
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          tabSize: 2,
          automaticLayout: true,
        }}
      />
    </div>
  )
}
