"use client"

import type React from "react"

import { useState } from "react"

export default function Contact() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  })

  const [showDialog, setShowDialog] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowDialog(true)
    // In a real app, you would send the form data to your backend here
  }

  return (
    <section id="contact" className="py-16 px-4 bg-black">
      <div className="container mx-auto max-w-md">
        <div className="pixel-dialog border-2 border-white">
          <div className="dialog-title-bar bg-electric-blue text-black px-4 py-2 flex justify-between items-center">
            <span className="font-bold">CONTACT WIZARD</span>
            <span>?</span>
          </div>

          <div className="p-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm mb-1">YOUR NAME:</label>
                <input
                  type="text"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  className="pixel-input w-full bg-black border-2 border-white p-2 text-white"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-1">YOUR EMAIL:</label>
                <input
                  type="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  className="pixel-input w-full bg-black border-2 border-white p-2 text-white"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-1">YOUR MESSAGE:</label>
                <textarea
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  rows={4}
                  className="pixel-input w-full bg-black border-2 border-white p-2 text-white resize-none"
                  required
                />
              </div>

              <button type="submit" className="pixel-button bg-electric-blue text-black px-4 py-2 w-full font-bold">
                SEND MESSAGE
              </button>
            </form>
          </div>
        </div>

        {showDialog && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80">
            <div className="pixel-dialog border-2 border-white max-w-sm w-full">
              <div className="dialog-title-bar bg-electric-blue text-black px-4 py-2 flex justify-between items-center">
                <span className="font-bold">CONFIRM</span>
                <button onClick={() => setShowDialog(false)}>×</button>
              </div>

              <div className="p-4 text-center">
                <p className="mb-4">Are you sure you want to contact this wizard?</p>
                <div className="flex gap-4 justify-center">
                  <button
                    className="pixel-button bg-electric-blue text-black px-4 py-2"
                    onClick={() => setShowDialog(false)}
                  >
                    YES
                  </button>
                  <button className="pixel-button border-2 border-white px-4 py-2" onClick={() => setShowDialog(false)}>
                    NO
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

