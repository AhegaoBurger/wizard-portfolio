"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Github, Twitter, Linkedin, Mail } from "lucide-react"

export default function Footer() {
  const [time, setTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const seconds = now.getSeconds()
      const ampm = hours >= 12 ? "PM" : "AM"

      const formattedHours = hours % 12 || 12
      const formattedMinutes = minutes.toString().padStart(2, "0")
      const formattedSeconds = seconds.toString().padStart(2, "0")

      setTime(`${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <footer className="border-t-2 border-white border-pixel py-6 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="pixel-clock border border-white px-3 py-1">{time}</div>

          <div className="flex gap-4">
            <SocialIcon href="https://github.com" icon={<Github className="h-5 w-5" />} />
            <SocialIcon href="https://twitter.com" icon={<Twitter className="h-5 w-5" />} />
            <SocialIcon href="https://linkedin.com" icon={<Linkedin className="h-5 w-5" />} />
            <SocialIcon href="mailto:wizard@example.com" icon={<Mail className="h-5 w-5" />} />
          </div>

          <div className="text-xs pixel-text">© {new Date().getFullYear()} PIXEL WIZARD. ALL RIGHTS RESERVED.</div>
        </div>
      </div>
    </footer>
  )
}

function SocialIcon({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="pixel-icon border border-white w-8 h-8 flex items-center justify-center hover:bg-electric-blue hover:text-black transition-colors"
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon}
    </Link>
  )
}

