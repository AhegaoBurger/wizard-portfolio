import type React from "react"

export default function DesktopLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-black p-4 font-pixel overflow-hidden relative ambient-particles">{children}</div>
}
