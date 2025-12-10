
import { useState, useRef } from "react";
import { motion } from "framer-motion";

interface DraggableSpellProps {
  name: string;
  icon: string;
  color?: string;
}

export default function DraggableSpell({
  name,
  icon,
  color = "white",
}: DraggableSpellProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [explosions, setExplosions] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const constraintsRef = useRef<HTMLDivElement>(null);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: any, info: any) => {
    setIsDragging(false);

    // Create explosion at drop point
    const newExplosion = {
      id: Date.now(),
      x: info.point.x,
      y: info.point.y,
    };

    setExplosions((prev) => [...prev, newExplosion]);

    // Remove explosion after animation completes
    setTimeout(() => {
      setExplosions((prev) => prev.filter((exp) => exp.id !== newExplosion.id));
    }, 1000);

    // Reset position
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="relative" ref={constraintsRef}>
      <motion.div
        className="w-12 h-12 border border-white flex items-center justify-center cursor-grab active:cursor-grabbing"
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        animate={position}
        whileDrag={{ scale: 1.1, boxShadow: "0 0 0 1px white" }}
      >
        <div className="text-white text-xs">{icon}</div>
      </motion.div>

      {/* Spell name */}
      <div className="text-white text-xs text-center mt-1">{name}</div>

      {/* Explosions */}
      {explosions.map((explosion) => (
        <Explosion key={explosion.id} x={explosion.x} y={explosion.y} />
      ))}
    </div>
  );
}

function Explosion({ x, y }: { x: number; y: number }) {
  const particles = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="fixed pointer-events-none z-50" style={{ left: x, top: y }}>
      {particles.map((particle, index) => {
        const angle = (index / particles.length) * 360;
        const distance = Math.random() * 30 + 10;

        return (
          <motion.div
            key={index}
            className="absolute w-2 h-2 bg-white"
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{
              x: Math.cos(angle * (Math.PI / 180)) * distance,
              y: Math.sin(angle * (Math.PI / 180)) * distance,
              opacity: 0,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}
