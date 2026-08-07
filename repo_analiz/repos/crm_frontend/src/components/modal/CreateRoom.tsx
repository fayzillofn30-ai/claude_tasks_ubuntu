"use client"
import { Rooms } from "@/features"
import { Room } from "@/types"
import React, { useState } from "react"

interface CreateroomPropsType {
  setModal: React.Dispatch<React.SetStateAction<boolean>>
  setRooms: React.Dispatch<React.SetStateAction<Room>>
}

function CreateRoom({ setModal, setRooms }: CreateroomPropsType) {
  const [form, setForm] = useState({
    name: "",
    romNumber: 0,
    pleaces: 0,
    isOpen: true,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const data = {
      name: form.name,
      romNumber: Number(form.romNumber),
      pleaces: Number(form.pleaces),
      isOpen: form.isOpen,
    }

    try {
      const result = await Rooms.createRoom(data)

      console.log("✅ Room created:", result)
      alert("Room successfully created!")
    } catch (error) {
      console.error("❌ Error creating room:", error)
      alert("Error creating room")
    }
  }

  return (
    <div className="fixed top-0 right-0 h-screen w-[30%] border-l-2 bg-white shadow-2xl overflow-y-auto p-4">
      <div className="flex">
        <h2 className="text-xl font-semibold mb-4">Create Room</h2>
        <button className="rounded-2xl shadow-2xl p-2 " onClick={() => setModal(false)}>Close</button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          placeholder="Room name (e.g. Room A-101)"
          value={form.name}
          onChange={handleChange}
          className="w-full py-3 px-4 border rounded-lg"
          required
        />

        <input
          type="number"
          name="romNumber"
          placeholder="Room number (e.g. 101)"
          value={form.romNumber}
          onChange={handleChange}
          className="w-full py-3 px-4 border rounded-lg"
          min={1}
          required
        />

        <input
          type="number"
          name="pleaces"
          placeholder="Number of seats"
          value={form.pleaces}
          onChange={handleChange}
          className="w-full py-3 px-4 border rounded-lg"
          min={1}
          required
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isOpen"
            checked={form.isOpen}
            onChange={handleChange}
            className="w-5 h-5"
          />
          <span>Is Open</span>
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all"
        >
          Create Room
        </button>
      </form>
    </div>
  )
}

export default CreateRoom
