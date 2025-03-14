"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Window from "@/components/window"
import Clock from "@/components/clock"
import BackButton from "@/components/back-button"

type TrashItem = {
  name: string
  type: string
  dateDeleted: string
  reason: string
}

const trashItems: TrashItem[] = [
  {
    name: "jQuery_Scroll",
    type: "Legacy Code",
    dateDeleted: "2020-05-15",
    reason: "Replaced with modern JavaScript and Intersection Observer API",
  },
  {
    name: "Flash_Animation",
    type: "Deprecated Technology",
    dateDeleted: "2019-12-20",
    reason: "Flash was discontinued, replaced with HTML5 Canvas and CSS animations",
  },
  {
    name: "IE_Support",
    type: "Browser Support",
    dateDeleted: "2022-06-15",
    reason: "Internet Explorer reached end-of-life, no longer needed special support",
  },
  {
    name: "PHP_Blog",
    type: "Old Project",
    dateDeleted: "2021-03-10",
    reason: "Migrated to a modern JAMstack architecture with better performance",
  },
  {
    name: "Social_Life.exe",
    type: "Personal",
    dateDeleted: "2023-01-01",
    reason: "Too busy coding to maintain",
  },
]

export default function TrashPage() {
  const router = useRouter()
  const [selectedItem, setSelectedItem] = useState<TrashItem | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [isClicking, setIsClicking] = useState(false)

  // Track mouse position for custom cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  return (
    <div className="min-h-screen bg-black p-4 font-pixel overflow-hidden relative">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Window title="Trash_Bin" width="w-80" height="h-96" x="left-4" y="top-4">
              <div className="flex flex-col gap-2 h-full">
                <div className="border border-white p-2 mb-2">
                  <h2 className="text-white text-center font-bold mb-2">DELETED ITEMS</h2>
                  <p className="text-white text-xs text-center">Items that have been discarded</p>
                </div>

                <div className="flex-1 overflow-auto">
                  {trashItems.map((item, index) => (
                    <motion.div
                      key={index}
                      className="p-2 mb-2 border border-white cursor-pointer"
                      onClick={() => setSelectedItem(item)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-white font-bold text-sm">{item.name}</span>
                        <span className="text-white text-xs">{item.type}</span>
                      </div>
                      <div className="text-white text-xs">
                        Deleted: {new Date(item.dateDeleted).toLocaleDateString()}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-between">
                  <button className="border border-white px-2 py-1 text-white text-xs" onClick={() => router.push("/")}>
                    CLOSE
                  </button>
                  <button
                    className="border border-white px-2 py-1 bg-white text-black text-xs"
                    onClick={() => setShowConfirm(true)}
                  >
                    EMPTY TRASH
                  </button>
                </div>
              </div>
            </Window>
          </motion.div>

          {selectedItem && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Window title={`Item: ${selectedItem.name}`} width="w-72" height="h-auto" x="right-4" y="top-4">
                <div className="p-2">
                  <div className="mb-4 border border-white p-2">
                    <div className="flex justify-between mb-2">
                      <span className="text-white text-sm font-bold">Type:</span>
                      <span className="text-white text-sm">{selectedItem.type}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-white text-sm font-bold">Deleted:</span>
                      <span className="text-white text-sm">
                        {new Date(selectedItem.dateDeleted).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-white text-sm font-bold mb-1">Reason for deletion:</div>
                    <p className="text-white text-xs border border-white p-2">{selectedItem.reason}</p>
                  </div>

                  <div className="flex justify-between">
                    <button
                      className="border border-white px-2 py-1 text-white text-xs"
                      onClick={() => setSelectedItem(null)}
                    >
                      CLOSE
                    </button>
                    <button
                      className="border border-white px-2 py-1 bg-white text-black text-xs"
                      onClick={() => setSelectedItem(null)}
                    >
                      RESTORE
                    </button>
                  </div>
                </div>
              </Window>
            </motion.div>
          )}

          {showConfirm && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-72 border border-white bg-black"
              >
                <div className="p-4 flex flex-col items-center">
                  <div className="mb-2">
                    <div className="w-8 h-8 border border-white flex items-center justify-center mb-2 mx-auto">
                      <div className="text-white text-xl">!</div>
                    </div>
                  </div>

                  <p className="text-white text-sm text-center mb-4">
                    Are you sure you want to permanently delete all items?
                  </p>

                  <div className="flex gap-4">
                    <button
                      className="border border-white px-4 py-1 text-white text-sm"
                      onClick={() => setShowConfirm(false)}
                    >
                      CANCEL
                    </button>
                    <button
                      className="border border-white px-4 py-1 bg-white text-black text-sm"
                      onClick={() => {
                        // In a real app, you would delete the items here
                        setShowConfirm(false)
                      }}
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="fixed bottom-4 left-4"
          >
            <BackButton onClick={() => router.push("/")} />
          </motion.div>

          <Clock />

          {/* Custom cursor */}
          <div
            className="fixed pointer-events-none z-50"
            style={{
              left: `${cursorPosition.x}px`,
              top: `${cursorPosition.y}px`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className={`w-4 h-4 border border-white ${isClicking ? "bg-white" : ""}`}></div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

