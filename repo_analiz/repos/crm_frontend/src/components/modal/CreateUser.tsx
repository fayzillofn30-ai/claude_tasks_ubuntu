"use client"
import React, { useEffect, useState } from "react"
import { Users } from "@/features"
import { useAllFetchedData } from "@/lib/ui.state"
import { User } from "@/types"
import { Button } from "@mui/material"

interface CreateUserProps {
  onSuccess?: (res : User) => void // 🔹 muvaffaqiyatdan keyin ishlaydigan callback
  setModal : React.Dispatch<React.SetStateAction<boolean>>
}

function CreateUser({ onSuccess ,setModal}: CreateUserProps) {

  const { fetchAll } = useAllFetchedData()

  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    father: "",
    phone: "",
    birthDay: "",
    image: null as File | null,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === "image" && files ? files[0] : value,
    }))
  }

  const resetForm = () => {
    setForm({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      father: "",
      phone: "",
      birthDay: "",
      image: null,
    })
  }
  useEffect(() => {
    resetForm()
  }, [])

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      console.log(form)
      const formData = new FormData()
      formData.append("email", form.email)
      formData.append("password", form.password)
      formData.append("firstName", form.firstName)
      formData.append("lastName", form.lastName)
      if (form.father) formData.append("father", form.father)
      if (form.phone) formData.append("phone", form.phone)
      formData.append("birthDay", new Date(form.birthDay).toISOString())
      if (form.image) formData.append("image", form.image)

      const res = await Users.usersApi.create(formData)
      console.log("✅ User created:", res)

      // 🔹 1️⃣ Forma reset qilinadi
      resetForm()

      // 🔹 2️⃣ onSuccess bo‘lsa, uni chaqiramiz (masalan, user ro‘yxatini yangilash yoki modalni yopish)
      if (onSuccess) onSuccess(res.user)
      setModal(false)  
    } catch (error) {
      console.error("❌ Xatolik:", error)
    }
  }

  return (
    <div className="w-[400px] flex flex-col space-y-10 p-4 rounded-2xl bg-gradient-to-b from-green-400 to-violet-500">
      <div className="flex justify-between">
        <h1>Yangi qo'shish</h1>
        <Button variant="contained" onClick={() => setModal(false)}>x</Button>
      </div>
      <form onSubmit={createUser} className="flex flex-col gap-4">
        <input name="firstName" type="text" placeholder="First name"
          value={form.firstName} onChange={handleChange} className="input" required />
        <input name="lastName" type="text" placeholder="Last name"
          value={form.lastName} onChange={handleChange} className="input" required />
        <input name="email" type="email" placeholder="Email"
          value={form.email} onChange={handleChange} className="input" required />
        <input name="password" type="password" placeholder="Password"
          value={form.password} onChange={handleChange} className="input" required />
        <input name="father" type="text" placeholder="Father’s name (optional)"
          value={form.father} onChange={handleChange} className="input" />
        <input name="phone" type="text" placeholder="Phone number (optional)"
          value={form.phone} onChange={handleChange} className="input" />
        <input name="birthDay" type="date"
          value={form.birthDay} onChange={handleChange} className="input" required />
        <input name="image" type="file" accept="image/*" onChange={handleChange} className="input" />

        <button type="submit" className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all">
          Create User
        </button>
      </form>
    </div>
  )
}

export default CreateUser
