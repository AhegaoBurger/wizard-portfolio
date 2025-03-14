"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const wizardLevel = 42

  return (
    <header className="border-b-2 border-white border-pixel px-4 py-2">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 relative">
            <div className="pixel-art wizard-hat"></div>
          </div>
          <span className="text-xl font-bold hidden md:block">CODE WIZARD</span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <NavItems />
        </div>

        <div className="flex items-center gap-4">
          <div className="pixel-counter">
            <div className="pixel-counter-label">WIZARD LVL</div>
            <div className="pixel-counter-value">{wizardLevel.toString().padStart(2, "0")}/99</div>
          </div>

          <button className="md:hidden pixel-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden absolute left-0 right-0 bg-black border-b-2 border-white border-pixel z-50 transition-all duration-300",
          isMenuOpen ? "max-h-64 py-4" : "max-h-0 overflow-hidden",
        )}
      >
        <div className="container mx-auto px-4 flex flex-col gap-4">
          <NavItems mobile onClick={() => setIsMenuOpen(false)} />
        </div>
      </div>
    </header>
  )
}

function NavItems({ mobile = false, onClick }: { mobile?: boolean; onClick?: () => void }) {
  return (
    <>
      {["SPELLS", "GRIMOIRE", "ARTIFACTS", "CONTACT"].map((item) => (
        <Link
          key={item}
          href={`#${item.toLowerCase()}`}
          className={cn(
            "spell-book-item transition-colors hover:text-electric-blue",
            mobile && "py-2 border-b border-dashed border-white/50 last:border-0",
          )}
          onClick={onClick}
        >
          {item}
        </Link>
      ))}
    </>
  )
}

