"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export default function Hero() {
  const [glowing, setGlowing] = useState(false)

  // Subtitle glowing effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGlowing((prev) => !prev)
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  return (
    <section id="spells" className="min-h-[90vh] flex flex-col items-center justify-center relative px-4 py-16">
      <div className="container mx-auto flex flex-col items-center text-center">
        <div className="wizard-avatar mb-8">
          <div className="pixel-wizard w-32 h-32 md:w-48 md:h-48 mx-auto"></div>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-4 pixel-text">PIXEL WIZARD</h1>

        <p
          className={cn(
            "text-lg md:text-xl mb-8 transition-colors duration-700",
            glowing ? "text-electric-blue" : "text-white",
          )}
        >
          Casting powerful web spells since 2015
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button className="pixel-button bg-electric-blue text-black px-6 py-3">VIEW SPELLBOOK</button>
          <button className="pixel-button border-2 border-white px-6 py-3">CONTACT WIZARD</button>
        </div>
      </div>
    </section>
  )
}

