"use client"

import { useState } from "react"
import Window from "@/components/window"

export default function ContactWindow() {
  const [message, setMessage] = useState("")

  return (
    <Window title="Send_Message" width="w-72" height="h-auto" x="right-4" y="top-[22rem]">
      <div className="flex flex-col gap-3">
        <div className="border border-white p-2">
          <h2 className="text-white text-center font-bold mb-2">CONTACT WIZARD</h2>
          <p className="text-white text-xs text-center mb-2">Your message will be delivered by magical owl.</p>

          <div className="flex flex-col gap-2">
            <div className="flex">
              <label className="w-16 text-white text-xs">Name:</label>
              <input type="text" className="flex-1 bg-black border border-white text-white text-xs p-1" />
            </div>

            <div className="flex">
              <label className="w-16 text-white text-xs">Email:</label>
              <input type="email" className="flex-1 bg-black border border-white text-white text-xs p-1" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-white text-xs">Message:</label>
              <textarea
                className="w-full h-20 bg-black border border-white text-white text-xs p-1 resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <button className="border border-white px-2 py-1 text-white text-xs">CLEAR</button>
          <button className="border border-white px-2 py-1 bg-white text-black text-xs">SEND</button>
        </div>
      </div>
    </Window>
  )
}

