"use client"

export default function FolderIcon({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 cursor-pointer">
      <div className="w-10 h-8 border border-white">
        <div className="w-4 h-1 border-t border-l border-r border-white mx-auto"></div>
      </div>
      <span className="text-xs text-white">{label}</span>
    </div>
  )
}

