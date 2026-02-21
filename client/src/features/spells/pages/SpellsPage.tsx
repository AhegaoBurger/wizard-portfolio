import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import Window from "@/shared/components/layout/window";
import PageShell from "@/shared/components/layout/page-shell";
import LoadingScreen from "@/shared/components/layout/loading-screen";
import DraggableSpell from "@/features/spells/components/draggable-spell";
import MobileLayout from "@/shared/components/layout/mobile-layout";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { useSpells } from "@/features/spells/api/spells.hooks";
import type { Spell } from "@shared/types";

export default function SpellsPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { spells, loading } = useSpells();
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);

  if (loading) {
    return <LoadingScreen />;
  }

  if (isMobile) {
    const spellListContent = (
      <div className="flex flex-col gap-2">
        <div className="border border-white p-2 mb-2">
          <h2 className="text-heading text-center mb-2">MAGICAL SPELLS</h2>
          <p className="text-white text-xs text-center">Select a spell to view its properties</p>
        </div>
        <div className="flex-1 overflow-auto">
          {spells.map((spell, index) => (
            <motion.div
              key={index}
              className={`p-2 mb-2 border border-white ${selectedSpell?.name === spell.name ? "bg-white text-black" : "text-white"}`}
              onClick={() => setSelectedSpell(spell)}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm">{spell.name}</span>
                <span className="text-xs">{spell.type}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );

    const spellCasterContent = (
      <div className="p-2">
        <div className="border border-white p-2 mb-4">
          <h2 className="text-white text-center font-bold mb-2">DRAG TO CAST</h2>
          <p className="text-white text-xs text-center">Drag a spell icon to cast it</p>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {spells.slice(0, 6).map((spell, index) => (
            <DraggableSpell key={index} name={spell.name.split("_")[0]} icon={spell.icon} />
          ))}
        </div>
      </div>
    );

    const spellDetailsContent = selectedSpell ? (
      <div className="p-2">
        <div className="mb-4 border border-white p-2">
          <div className="flex justify-between mb-2">
            <span className="text-white text-sm font-bold">Type:</span>
            <span className="text-white text-sm">{selectedSpell.type}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-white text-sm font-bold">Level:</span>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={`w-3 h-3 mx-px ${i < selectedSpell.level ? "bg-white" : "border border-white"}`}></div>
              ))}
            </div>
          </div>
        </div>
        <div className="mb-4">
          <div className="text-white text-sm font-bold mb-1">Description:</div>
          <p className="text-white text-xs border border-white p-2">{selectedSpell.description}</p>
        </div>
        <div className="border border-white p-2 bg-pattern-diagonal">
          <div className="text-white text-xs text-center">Casting this spell requires concentration and precise syntax</div>
        </div>
      </div>
    ) : (
      <div className="flex items-center justify-center h-full">
        <p className="text-white text-center">Select a spell to view details</p>
      </div>
    );

    const windows = [
      { id: "spellbook", title: "Spellbook", icon: "S", content: spellListContent },
      { id: "spellcaster", title: "Spell_Caster", icon: "C", content: spellCasterContent },
      { id: "spelldetails", title: "Spell_Details", icon: "D", content: spellDetailsContent },
    ];

    return <MobileLayout windows={windows} />;
  }

  return (
    <PageShell>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, duration: 0.3 }}>
        <Window title="Spellbook" width="w-80" height="h-96" x="left-4" y="top-4">
          <div className="flex flex-col gap-2 h-full">
            <div className="border border-white p-2 mb-2">
              <h2 className="text-heading text-center mb-2">MAGICAL SPELLS</h2>
              <p className="text-white text-xs text-center">Drag spells to cast them!</p>
            </div>
            <div className="flex-1 overflow-auto border border-white p-2">
              {spells.map((spell, index) => (
                <motion.div
                  key={index}
                  className={`p-2 mb-2 border border-white cursor-pointer ${selectedSpell?.name === spell.name ? "bg-white text-black" : "text-white"}`}
                  onClick={() => setSelectedSpell(spell)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm">{spell.name}</span>
                    <span className="text-xs">{spell.type}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Window>
      </motion.div>

      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, duration: 0.3 }}>
        <Window title="Spell_Caster" width="w-72" height="h-auto" x="right-4" y="top-4">
          <div className="p-2">
            <div className="border border-white p-2 mb-4">
              <h2 className="text-heading text-center mb-2">DRAG TO CAST</h2>
              <p className="text-white text-xs text-center">Drag a spell icon to cast it</p>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {spells.slice(0, 6).map((spell, index) => (
                <DraggableSpell key={index} name={spell.name.split("_")[0]} icon={spell.icon} />
              ))}
            </div>
          </div>
        </Window>
      </motion.div>

      {selectedSpell && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ duration: 0.3 }}>
          <Window title={`Spell: ${selectedSpell.name}`} width="w-72" height="h-auto" x="right-4" y="top-[22rem]">
            <div className="p-2">
              <div className="mb-4 border border-white p-2">
                <div className="flex justify-between mb-2">
                  <span className="text-white text-sm font-bold">Type:</span>
                  <span className="text-white text-sm">{selectedSpell.type}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-white text-sm font-bold">Level:</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className={`w-3 h-3 mx-px ${i < selectedSpell.level ? "bg-white" : "border border-white"}`}></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <div className="text-white text-sm font-bold mb-1">Description:</div>
                <p className="text-white text-xs border border-white p-2">{selectedSpell.description}</p>
              </div>
              <div className="border border-white p-2 bg-pattern-diagonal">
                <div className="text-white text-xs text-center">Casting this spell requires concentration and precise syntax</div>
              </div>
            </div>
          </Window>
        </motion.div>
      )}
    </PageShell>
  );
}
