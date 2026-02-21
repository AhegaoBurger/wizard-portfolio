import { useEffect, useState } from "react"
import { cn } from "@/shared/utils"

export function Lightning() {
  const [bolts, setBolts] = useState<{ id: number; position: number; active: boolean }[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      const newBolt = {
        id: Date.now(),
        position: Math.random() * 100,
        active: true,
      }

      setBolts((prev) => [...prev, newBolt])

      setTimeout(() => {
        setBolts((prev) => prev.filter((bolt) => bolt.id !== newBolt.id))
      }, 1000)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {bolts.map((bolt) => (
        <div
          key={bolt.id}
          className={cn(
            "absolute top-0 bottom-0 w-[2px] bg-electric-blue lightning-bolt",
            bolt.active ? "animate-lightning" : "",
          )}
          style={{ left: `${bolt.position}%` }}
        />
      ))}
    </div>
  )
}
