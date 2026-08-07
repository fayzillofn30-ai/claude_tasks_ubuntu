"use client"

import React, { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Courses } from "@/features"
import { Course } from "@/types"

const weekDays = [
  { id: 1, name: "Dushanba" },
  { id: 2, name: "Seshanba" },
  { id: 3, name: "Chorshanba" },
  { id: 4, name: "Payshanba" },
  { id: 5, name: "Juma" },
  { id: 6, name: "Shanba" },
  { id: 0, name: "Yakshanba" },
]

type CourseUpdateModalProps = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  course: Course
  onUpdated: (updatedCourse: Course) => void
}

export default function CourseUpdateModal({
  open,
  setOpen,
  course,
  onUpdated,
}: CourseUpdateModalProps) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    durationMont: "",
    durationMinut: "",
    weekDays: [] as number[],
    published: false,
  })
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  // === Dastlabki ma'lumotlarni yuklash ===
  useEffect(() => {
    if (course) {
      setForm({
        name: course.name || "",
        price: course.price?.toString() || "",
        durationMont: course.durationMont?.toString() || "",
        durationMinut: course.durationMinut?.toString() || "",
        weekDays:
          Array.isArray(course.weekDays) && typeof course.weekDays[0] === "number"
            ? (course.weekDays as number[])
            : [],
        published: course.published || false,
      })
    }
  }, [course])

  // === Input o‘zgarishini kuzatish ===
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // === Haftalik kunlarni tanlash ===
  const toggleDay = (id: number) => {
    setForm((prev) => ({
      ...prev,
      weekDays: prev.weekDays.includes(id)
        ? prev.weekDays.filter((d) => d !== id)
        : [...prev.weekDays, id],
    }))
  }

  // === Formani yuborish ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const dto = {
        ...form,
        price: +form.price,
        durationMont: +form.durationMont,
        durationMinut: +form.durationMinut,
      }

      const updated = await Courses.coursesApi.update(course.id, dto, image || undefined)
      alert("✅ Kurs yangilandi!")
      onUpdated(updated.course)
      setOpen(false)
    } catch (err) {
      console.error(err)
      alert("❌ Kursni yangilashda xatolik!")
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed top-0 right-0 h-screen w-[35%] bg-white shadow-2xl border-l border-gray-200 flex flex-col overflow-y-auto z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800">✏️ Kursni tahrirlash</h2>
        <button onClick={() => setOpen(false)} className="p-2 hover:bg-gray-200 rounded-full">
          <X size={20} />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 text-sm text-gray-700">
        <Input label="Kurs nomi" name="name" value={form.name} onChange={handleChange} />
        <Input label="Narxi (so‘m)" name="price" type="number" value={form.price} onChange={handleChange} />
        <Input
          label="Davomiyligi (oy)"
          name="durationMont"
          type="number"
          value={form.durationMont}
          onChange={handleChange}
        />

        {/* Haftalik kunlar */}
        <div>
          <label className="block font-medium mb-1">Hafta kunlari</label>
          <div className="grid grid-cols-2 gap-2">
            {weekDays.map((d) => (
              <label
                key={d.id}
                className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer ${
                  form.weekDays.includes(d.id)
                    ? "bg-blue-50 border-blue-500 text-blue-600"
                    : "hover:bg-gray-100"
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.weekDays.includes(d.id)}
                  onChange={() => toggleDay(d.id)}
                />
                {d.name}
              </label>
            ))}
          </div>
        </div>

        <Input
          label="Dars davomiyligi (minut)"
          name="durationMinut"
          type="number"
          value={form.durationMinut}
          onChange={handleChange}
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="published"
            checked={form.published}
            onChange={handleChange}
          />
          <span>Kursni e’lon qilish</span>
        </div>

        <div>
          <label className="block font-medium mb-1">Kurs rasmi</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-full text-sm text-gray-600 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`py-3 mt-3 rounded-lg text-white font-semibold transition ${
            loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700 shadow"
          }`}
        >
          {loading ? "⏳ Saqlanmoqda..." : "Saqlash"}
        </button>
      </form>
    </div>
  )
}

// Reusable Input
function Input({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <label className="block font-medium mb-1">{label}</label>
      <input
        {...props}
        className="w-full py-2.5 px-4 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
      />
    </div>
  )
}
