"use client"
import React, { useEffect, useState } from "react"
import { Users } from "@/features"
import api from "@/lib/axios"

type UserType = {
  id: string
  fullName: string
  email: string
  roles?: { id: string; role: string; isDeleted: boolean }[] | null
}

function CreateRole() {

  const [users, setUsers] = useState<UserType[]>([])
  const [selectedUserId, setSelectedUserId] = useState("")
  const [role, setRole] = useState("STUDENT")
  const [loading, setLoading] = useState(false)

  // 🔹 Foydalanuvchilarni olish
  const fetchUsers = async () => {
    try {
      const res = await Users.usersApi.getAll()
      setUsers(res) // sizning backend response formatga qarab
    } catch (error) {
      console.error("❌ Foydalanuvchilarni olishda xatolik:", error)
    }
  }

  // 🔹 Role yaratish
  const createRole = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUserId) return alert("Iltimos, foydalanuvchini tanlang")

    try {
      setLoading(true)
      const res = await api.post("/admin/create-role", {
        userId: selectedUserId,
        role,
      })
      console.log("✅ Role created:", res.data)
      alert("Role muvaffaqiyatli yaratildi!")
    } catch (error) {
      console.error("❌ Xatolik:", error)
      alert("Role yaratishda xatolik yuz berdi!")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="fixed top-0 right-0 h-screen w-[30%] border-l bg-white shadow-2xl p-5 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Create Staff Role</h2>

      <form onSubmit={createRole} className="flex flex-col gap-4">
        {/* USER SELECT */}
        <div>
          <label className="block text-sm mb-1">Select User</label>
          <select
            className="w-full border rounded-lg p-3"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            <option value="">-- Choose user --</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.fullName} ({u.email})
              </option>
            ))}
          </select>
        </div>

        {/* ROLE SELECT */}
        <div>
          <label className="block text-sm mb-1">Select Role</label>
          <select
            className="w-full border rounded-lg p-3"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="STUDENT">STUDENT</option>
            <option value="TEACHER">TEACHER</option>
            <option value="ASISTANT">ASISTANT</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        <button
          disabled={loading}
          type="submit"
          className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all disabled:bg-gray-400"
        >
          {loading ? "Creating..." : "Create Role"}
        </button>
      </form>
    </div>
  )
}


export default CreateRole