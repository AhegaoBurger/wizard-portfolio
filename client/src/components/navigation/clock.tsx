
import { useState, useEffect } from "react"

export default function Clock() {
  const [time, setTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const seconds = now.getSeconds()

      const formattedHours = hours.toString().padStart(2, "0")
      const formattedMinutes = minutes.toString().padStart(2, "0")
      const formattedSeconds = seconds.toString().padStart(2, "0")

      const ampm = hours >= 12 ? "PM" : "AM"

      setTime(`${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed bottom-4 left-4 border border-white bg-black px-2 py-1 flex items-center">
      <div className="w-4 h-4 border border-white mr-2"></div>
      <span className="text-white text-xs">{time}</span>
    </div>
  )
}

