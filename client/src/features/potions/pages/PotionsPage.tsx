import { useState } from "react";
import { motion } from "framer-motion";
import Window from "@/shared/components/layout/window";
import PageShell from "@/shared/components/layout/page-shell";
import LoadingScreen from "@/shared/components/layout/loading-screen";
import { useTools } from "@/features/potions/api/potions.hooks";
import type { Tool } from "@shared/types";

export default function PotionsPage() {
  const { tools, loading } = useTools();
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <PageShell>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, duration: 0.3 }}>
        <Window title="Potion_Cabinet" width="w-80" height="h-96" x="left-4" y="top-4">
          <div className="flex flex-col gap-2 h-full">
            <div className="border border-white p-2 mb-2">
              <h2 className="text-heading text-center mb-2">MAGICAL TOOLS</h2>
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
                    <span className="text-white font-bold text-sm glow-text">{tool.name}</span>
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
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ duration: 0.3 }}>
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
    </PageShell>
  );
}
