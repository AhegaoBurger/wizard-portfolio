import type React from "react"
import { cn } from "@/lib/utils"

interface WindowProps {
  title: string
  children: React.ReactNode
  className?: string
  width?: string
  height?: string
  x?: string
  y?: string
}

export default function Window({
  title,
  children,
  className,
  width = "w-80",
  height = "h-auto",
  x = "left-4",
  y = "top-4",
}: WindowProps) {
  return (
    <div className={cn("absolute border border-white bg-black", width, height, x, y, className)}>
      <div className="border-b border-white bg-white text-black text-center py-1 font-bold">{title}</div>
      <div className="p-2">{children}</div>
    </div>
  )
}

