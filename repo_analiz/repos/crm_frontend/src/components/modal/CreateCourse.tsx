"use client"

import React, { useEffect, useState } from "react"
import { Courses, Rooms } from "@/features"
import { Room } from "@/features/roms"
import { X } from "lucide-react"
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

type CreateCourseProps = {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCourses : React.Dispatch<React.SetStateAction<Course[]>>
};

function CreateCourse({ setModal ,setCourses}: CreateCourseProps) {

  const [rooms, setRooms] = useState<Room[]>([])
  const [form, setForm] = useState({
    name: "",
    price: "",
    durationMont: "",
    weekDays: [] as number[],
    durationMinut: "",
    published: false,
  })
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<any>({})

  useEffect(() => {
    Rooms.getAllRooms().then(setRooms).catch(console.error)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const toggleDay = (id: number) => {
    setForm((prev) => ({
      ...prev,
      weekDays: prev.weekDays.includes(id)
        ? prev.weekDays.filter((d) => d !== id)
        : [...prev.weekDays, id],
    }))
  }

  const validateForm = () => {
    const newErrors: any = {}

    if (!form.name) newErrors.name = "Kurs nomini kiriting."
    if (!form.price || isNaN(+form.price)) newErrors.price = "To‘g‘ri narxni kiriting."
    if (!form.durationMont || isNaN(+form.durationMont)) newErrors.durationMont = "Davomiylikni kiriting."
    if (!form.durationMinut || isNaN(+form.durationMinut)) newErrors.durationMinut = "Dars davomiyligini kiriting."
    if (form.weekDays.length === 0) newErrors.weekDays = "Hafta kunlarini tanlang."

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset previous errors
    setErrors({})

    const newErrors = validateForm()

    // If there are validation errors, don't submit the form
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const dto = {
        ...form,
        price: +form.price,
        durationMont: +form.durationMont,
        durationMinut: +form.durationMinut,
      }
      const res = await Courses.coursesApi.create(dto, image || undefined)
      alert("✅ Kurs yaratildi!")
      setCourses(prev => {
        let old = [...prev]
        old.push(res.course)
        return old
      })
      setModal(false)
    } catch (err) {
      alert("❌ Xatolik: qayta urinib ko‘ring")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed top-0 right-0 h-screen w-[35%] bg-white shadow-2xl border-l border-gray-200 flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800">📘 Yangi kurs</h2>
        <button onClick={() => setModal(false)} className="p-2 hover:bg-gray-200 rounded-full">
          <X size={20} />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 text-sm text-gray-700">
        <Input
          name="name"
          label="Kurs nomi"
          placeholder="Masalan: Frontend"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
        />
        <Input
          name="price"
          label="Narxi (so‘m)"
          type="number"
          placeholder="150000"
          value={form.price}
          onChange={handleChange}
          error={errors.price}
        />
        <Input
          name="durationMont"
          label="Davomiyligi (oy)"
          type="number"
          placeholder="4"
          value={form.durationMont}
          onChange={handleChange}
          error={errors.durationMont}
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
          {errors.weekDays && <span className="text-red-500 text-xs">{errors.weekDays}</span>}
        </div>

        <Input
          name="durationMinut"
          label="Dars davomiyligi (minut)"
          type="number"
          placeholder="90"
          value={form.durationMinut}
          onChange={handleChange}
          error={errors.durationMinut}
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
          {loading ? "⏳ Yaratilmoqda..." : "Yaratish"}
        </button>
      </form>
    </div>
  )
}

export default CreateCourse

// Reusable Input
function Input({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <div>
      <label className="block font-medium mb-1">{label}</label>
      <input
        {...props}
        className={`w-full py-2.5 px-4 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none ${error ? "border-red-500" : ""}`}
      />
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  )
}
