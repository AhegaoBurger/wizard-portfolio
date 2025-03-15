"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Window from "@/components/window";
import Clock from "@/components/clock";
import BackButton from "@/components/back-button";
import DraggableSpell from "@/components/draggable-spell";
import ManaBar from "@/components/mana-bar";
import MobileLayout from "@/components/mobile-layout";
import { useIsMobile } from "@/hooks/use-mobile";

type Spell = {
  name: string;
  type: string;
  level: number;
  description: string;
  icon: string;
};

const spells: Spell[] = [
  {
    name: "HTML_Structurum",
    type: "Structure",
    level: 5,
    description: "Creates semantic structures from pure thought",
    icon: "<>",
  },
  {
    name: "CSS_Stylius",
    type: "Styling",
    level: 4,
    description: "Transforms plain elements into visual wonders",
    icon: "{}",
  },
  {
    name: "JS_Interactivus",
    type: "Logic",
    level: 5,
    description: "Breathes life and behavior into static elements",
    icon: "()",
  },
  {
    name: "React_Componentium",
    type: "Component",
    level: 4,
    description: "Summons reusable interface elements",
    icon: "⚛️",
  },
  {
    name: "API_Fetchus",
    type: "Data",
    level: 3,
    description: "Retrieves data from distant magical realms",
    icon: "⟲",
  },
  {
    name: "Debuggus_Maxima",
    type: "Utility",
    level: 4,
    description: "Reveals and banishes bugs from your code",
    icon: "⚔️",
  },
];

export default function SpellsPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);

  // Track mouse position for custom cursor (desktop only)
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isMobile]);

  if (isMobile) {
    const spellListContent = (
      <div className="flex flex-col gap-2">
        <div className="border border-white p-2 mb-2">
          <h2 className="text-white text-center font-bold mb-2">
            MAGICAL SPELLS
          </h2>
          <p className="text-white text-xs text-center">
            Select a spell to view its properties
          </p>
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
          <h2 className="text-white text-center font-bold mb-2">
            DRAG TO CAST
          </h2>
          <p className="text-white text-xs text-center">
            Drag a spell icon to cast it
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          {spells.slice(0, 6).map((spell, index) => (
            <DraggableSpell
              key={index}
              name={spell.name.split("_")[0]}
              icon={spell.icon}
            />
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
                <div
                  key={i}
                  className={`w-3 h-3 mx-px ${i < selectedSpell.level ? "bg-white" : "border border-white"}`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-white text-sm font-bold mb-1">Description:</div>
          <p className="text-white text-xs border border-white p-2">
            {selectedSpell.description}
          </p>
        </div>

        <div className="border border-white p-2 bg-pattern-diagonal">
          <div className="text-white text-xs text-center">
            Casting this spell requires concentration and precise syntax
          </div>
        </div>
      </div>
    ) : (
      <div className="flex items-center justify-center h-full">
        <p className="text-white text-center">Select a spell to view details</p>
      </div>
    );

    const windows = [
      {
        id: "spellbook",
        title: "Spellbook",
        icon: "📖",
        content: spellListContent,
      },
      {
        id: "spellcaster",
        title: "Spell_Caster",
        icon: "✨",
        content: spellCasterContent,
      },
      {
        id: "spelldetails",
        title: "Spell_Details",
        icon: "🔍",
        content: spellDetailsContent,
      },
    ];

    return <MobileLayout windows={windows} />;
  }

  return (
    <div className="min-h-screen bg-black p-4 font-pixel overflow-hidden relative">
      <ManaBar />

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
            <Window
              title="Spellbook"
              width="w-80"
              height="h-96"
              x="left-4"
              y="top-4"
            >
              <div className="flex flex-col gap-2 h-full">
                <div className="border border-white p-2 mb-2">
                  <h2 className="text-white text-center font-bold mb-2">
                    MAGICAL SPELLS
                  </h2>
                  <p className="text-white text-xs text-center">
                    Drag spells to cast them!
                  </p>
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

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <Window
              title="Spell_Caster"
              width="w-72"
              height="h-auto"
              x="right-4"
              y="top-4"
            >
              <div className="p-2">
                <div className="border border-white p-2 mb-4">
                  <h2 className="text-white text-center font-bold mb-2">
                    DRAG TO CAST
                  </h2>
                  <p className="text-white text-xs text-center">
                    Drag a spell icon to cast it
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  {spells.slice(0, 6).map((spell, index) => (
                    <DraggableSpell
                      key={index}
                      name={spell.name.split("_")[0]}
                      icon={spell.icon}
                    />
                  ))}
                </div>
              </div>
            </Window>
          </motion.div>

          {selectedSpell && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Window
                title={`Spell: ${selectedSpell.name}`}
                width="w-72"
                height="h-auto"
                x="right-4"
                y="top-[22rem]"
              >
                <div className="p-2">
                  <div className="mb-4 border border-white p-2">
                    <div className="flex justify-between mb-2">
                      <span className="text-white text-sm font-bold">
                        Type:
                      </span>
                      <span className="text-white text-sm">
                        {selectedSpell.type}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-white text-sm font-bold">
                        Level:
                      </span>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 mx-px ${i < selectedSpell.level ? "bg-white" : "border border-white"}`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-white text-sm font-bold mb-1">
                      Description:
                    </div>
                    <p className="text-white text-xs border border-white p-2">
                      {selectedSpell.description}
                    </p>
                  </div>

                  <div className="border border-white p-2 bg-pattern-diagonal">
                    <div className="text-white text-xs text-center">
                      Casting this spell requires concentration and precise
                      syntax
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
            className="fixed bottom-4 right-4"
          >
            <BackButton onClickAction={() => router.push("/")} />
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
            <div
              className={`w-4 h-4 border border-white ${isClicking ? "bg-white" : ""}`}
            ></div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
