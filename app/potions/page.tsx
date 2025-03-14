"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Window from "@/components/window"
import Clock from "@/components/clock"
import BackButton from "@/components/back-button"

type Tool = {
  name: string
  category: string
  mastery: number
  description: string
  uses: string[]
}

const tools: Tool[] = [
  {
    name: "Git_Potion",
    category: "Version Control",
    mastery: 90,
    description: "A magical brew that allows you to track changes and collaborate with other wizards.",
    uses: [
      "Track code changes",
      "Branch and merge spells",
      "Collaborate with other wizards",
      "Revert to previous versions",
    ],
  },
  {
    name: "Docker_Elixir",
    category: "Containerization",
    mastery: 75,
    description: "Package your spells and all their dependencies into portable containers.",
    uses: [
      "Create isolated environments",
      "Ensure consistent deployments",
      "Scale applications easily",
      "Simplify configuration",
    ],
  },
  {
    name: "VS_Code_Tincture",
    category: "Development",
    mastery: 95,
    description: "A powerful editor potion that enhances your spell-writing abilities.",
    uses: ["Syntax highlighting", "Integrated terminal", "Extensions and plugins", "Debugging tools"],
  },
  {
    name: "Jest_Serum",
    category: "Testing",
    mastery: 80,
    description: "A testing solution that ensures your spells work as intended.",
    uses: ["Unit testing", "Integration testing", "Mocking capabilities", "Coverage reports"],
  },
  {
    name: "Figma_Extract",
    category: "Design",
    mastery: 70,
    description: "A design tool that helps visualize your magical interfaces before casting them.",
    uses: ["UI/UX design", "Prototyping", "Collaboration", "Design systems"],
  },
]

export default function PotionsPage() {
  const router = useRouter()
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null)
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
            <Window title="Potion_Cabinet" width="w-80" height="h-96" x="left-4" y="top-4">
              <div className="flex flex-col gap-2 h-full">
                <div className="border border-white p-2 mb-2">
                  <h2 className="text-white text-center font-bold mb-2">MAGICAL TOOLS</h2>
                  <p className="text-white text-xs text-center">Select a tool to view its properties</p>
                </div>

                <div className="flex-1 overflow-auto">
                  {tools.map((tool, index) => (
                    <motion.div
                      key={index}
                      className="p-2 mb-2 border border-white cursor-pointer"
                      onClick={() => setSelectedTool(tool)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-white font-bold text-sm">{tool.name}</span>
                        <span className="text-white text-xs">{tool.category}</span>
                      </div>
                      <div className="w-full h-4 border border-white flex items-center px-1">
                        <div className="h-2 bg-white" style={{ width: `${tool.mastery}%` }}></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Window>
          </motion.div>

          {selectedTool && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Window title={`Tool: ${selectedTool.name}`} width="w-80" height="h-auto" x="right-4" y="top-4">
                <div className="p-2">
                  <div className="mb-4 border border-white p-2">
                    <div className="flex justify-between mb-2">
                      <span className="text-white text-sm font-bold">Category:</span>
                      <span className="text-white text-sm">{selectedTool.category}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-white text-sm font-bold">Mastery:</span>
                      <span className="text-white text-sm">{selectedTool.mastery}%</span>
                    </div>
                    <div className="w-full h-4 border border-white flex items-center px-1">
                      <div className="h-2 bg-pattern-diagonal" style={{ width: `${selectedTool.mastery}%` }}></div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-white text-sm font-bold mb-1">Description:</div>
                    <p className="text-white text-xs border border-white p-2">{selectedTool.description}</p>
                  </div>

                  <div className="mb-4">
                    <div className="text-white text-sm font-bold mb-1">Common Uses:</div>
                    <div className="border border-white p-2">
                      {selectedTool.uses.map((use, index) => (
                        <div key={index} className="flex items-start mb-1 last:mb-0">
                          <div className="w-3 h-3 border border-white mr-2 mt-px flex items-center justify-center">
                            <div className="w-1 h-1 bg-white"></div>
                          </div>
                          <span className="text-white text-xs">{use}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Window>
            </motion.div>
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

