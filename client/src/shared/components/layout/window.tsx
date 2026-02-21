import type React from "react"
import { cn } from "@/shared/utils"
import { motion, useDragControls } from "framer-motion"

interface WindowProps {
  title: string
  children: React.ReactNode
  className?: string
  width?: string
  height?: string
  x?: string
  y?: string
  draggable?: boolean
  dragConstraints?: React.RefObject<HTMLElement | null>
  zIndex?: number
  onFocus?: () => void
  onMinimize?: () => void
  onClose?: () => void
}

export default function Window({
  title,
  children,
  className,
  width = "w-80",
  height = "h-auto",
  x = "left-4",
  y = "top-4",
  draggable,
  dragConstraints,
  zIndex,
  onFocus,
  onMinimize,
  onClose,
}: WindowProps) {
  const dragControls = useDragControls()

  if (draggable) {
    return (
      <motion.div
        className={cn("absolute window-chrome", width, height, x, y, className)}
        style={zIndex != null ? { zIndex } : undefined}
        drag
        dragControls={dragControls}
        dragListener={false}
        dragMomentum={false}
        dragElastic={0.05}
        dragConstraints={dragConstraints}
        onPointerDown={() => onFocus?.()}
      >
        <div
          className="window-title-bar flex items-center justify-between px-1 select-none"
          style={{ cursor: "grab" }}
          onPointerDown={(e) => {
            onFocus?.()
            dragControls.start(e)
          }}
        >
          <div className="flex items-center gap-1">
            {onMinimize && (
              <button
                className="w-3 h-3 border border-black hover:bg-black hover:text-white flex items-center justify-center text-[8px] leading-none"
                onClick={(e) => {
                  e.stopPropagation()
                  onMinimize()
                }}
                aria-label="Minimize"
              >
                −
              </button>
            )}
            {onClose && (
              <button
                className="w-3 h-3 border border-black hover:bg-black hover:text-white flex items-center justify-center text-[8px] leading-none"
                onClick={(e) => {
                  e.stopPropagation()
                  onClose()
                }}
                aria-label="Close"
              >
                ×
              </button>
            )}
          </div>
          <span className="flex-1 text-center">{title}</span>
          <div className="w-8" />
        </div>
        <div className="p-2">{children}</div>
      </motion.div>
    )
  }

  return (
    <div className={cn("absolute window-chrome", width, height, x, y, className)}>
      <div className="window-title-bar">{title}</div>
      <div className="p-2">{children}</div>
    </div>
  )
}
