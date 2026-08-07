"use client"

import React, { useEffect, useState } from "react"
import { Groupes, Staffs, Courses, Rooms } from "@/features"
import { X } from "lucide-react"
import { Group } from "@/types"

type CreateGroupProps = {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  setGroupes : React.Dispatch<React.SetStateAction<Group[]>>
  
};

function CreateGroup({setModal,setGroupes} : CreateGroupProps) {
  const [teachers, setTeachers] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false) // ✅ yangi holat

  const [form, setForm] = useState({
    name: "",
    teacherId: "",
    courseId: "",
    romId: "",
    startDate: "",
    isStart: false,
    isEnd: false,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const staffRes = await Staffs.getAllStaffs()
        const teacherList = staffRes.staffs.filter((s: any) => s.role === "TEACHER")
        setTeachers(teacherList)

        const courseRes = await Courses.coursesApi.getAll()
        setCourses(courseRes || [])

        const roomRes = await Rooms.getAllRooms()
        setRooms(roomRes || [])
      } catch (err) {
        console.error("❌ Error fetching data:", err)
      }
    }
    fetchData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement
    const { name, value, type } = target
    const checked = (target as HTMLInputElement).checked
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setIsSubmitted(true) // ✅ inputlarni bloklash

    const dto = {
      name: form.name,
      teacherId: form.teacherId,
      courseId: form.courseId,
      romId: form.romId,
      isEnd: form.isEnd,
      isStart: form.isStart,
      startDate: new Date(form.startDate).toISOString(),
    }

    try {
      const res = await Groupes.createGroupe(dto)
      console.log("✅ Groupe created:", res)
      alert("Group created successfully!")
      setGroupes(prev => {
        const old = [...prev]
        return [...old,res]
      })
      // ✅ 1 sekunddan keyin loadingni to‘xtatamiz va modalni yopamiz
      setTimeout(() => {
        setLoading(false)
        setIsSubmitted(false)
        setModal(false)
      }, 1000)
    } catch (err) {
      console.error("❌ Error creating group:", err)
      alert("Error creating group")
      setLoading(false)
      setIsSubmitted(false)
    }
  }

  return (
    <div className="fixed top-0 right-0 h-screen w-[35%] border-l bg-white shadow-2xl overflow-y-auto p-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-3">
        <h2 className="text-2xl font-semibold">Create Group</h2>
        <button
          onClick={() => setModal(false)}
          className="p-2 hover:bg-gray-100 rounded-full transition"
          aria-label="Close"
          disabled={loading} // ✅ loading bo‘lsa yopib bo‘lmaydi
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          placeholder="Group name (e.g. Backend A1)"
          value={form.name}
          onChange={handleChange}
          className="w-full py-3 px-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          required
          disabled={isSubmitted} // ✅ submitdan keyin blok
        />

        <select
          name="teacherId"
          value={form.teacherId}
          onChange={handleChange}
          className="w-full py-3 px-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          required
          disabled={isSubmitted}
        >
          <option value="">Select teacher</option>
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.user?.fullName || "No name"}
            </option>
          ))}
        </select>

        <select
          name="courseId"
          value={form.courseId}
          onChange={handleChange}
          className="w-full py-3 px-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          required
          disabled={isSubmitted}
        >
          <option value="">Select course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          name="romId"
          value={form.romId}
          onChange={handleChange}
          className="w-full py-3 px-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          required
          disabled={isSubmitted}
        >
          <option value="">Select room</option>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} ({r.romNumber})
            </option>
          ))}
        </select>

        <label className="text-sm font-medium text-gray-600">Start date</label>
        <input
          type="datetime-local"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          className="w-full py-3 px-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          required
          disabled={isSubmitted}
        />

        <div className="flex items-center justify-between border-t pt-3 mt-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isStart"
              checked={form.isStart}
              onChange={handleChange}
              className="w-4 h-4"
              disabled={isSubmitted}
            />
            Start group
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isEnd"
              checked={form.isEnd}
              onChange={handleChange}
              className="w-4 h-4"
              disabled={isSubmitted}
            />
            End group
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all mt-2 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Creating..." : "Create Group"}
        </button>
      </form>
    </div>
  )
}

export default CreateGroup
