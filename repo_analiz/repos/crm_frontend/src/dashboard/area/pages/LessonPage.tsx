"use client"

import React, { useEffect, useState } from "react"
import { Attendentionals, Staffs } from "@/features"
import { useSelectedStore } from "@/lib/ui.state"
import AddAttendense from "./AddAttendense"

function LessonPage() {
  const { selectedLessonId, selectedGroupId } = useSelectedStore()
  const [students, setStudents] = useState<any[]>([])
  const [attendance, setAttendance] = useState<Record<string, {
    kelgan: boolean
    kelganVaqti?: string
    isDeleted?: boolean
  }>>({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  // 🧑‍🎓 O‘quvchilarni olish
  const handleFetchStudents = async () => {
    if (!selectedGroupId) return
    setLoading(true)
    try {
      const res = await Staffs.getStudentsByGroupId(selectedGroupId)
      setStudents(res)
      const init = res.reduce((acc: any, s: any) => {
        acc[s.id] = { kelgan: false, kelganVaqti: "", isDeleted: false }
        return acc
      }, {})
      setAttendance(init)
    } catch (err) {
      console.error("Xatolik:", err)
    } finally {
      setLoading(false)
    }
  }

  // 💾 Davomatni saqlash
  const handleSaveAttendance = async () => {
    setErrorMsg("")

    if (!selectedLessonId) {
      setErrorMsg("❗ Dars tanlanmagan.")
      return
    }

    // Kerakli maydonlarni tekshirish
    const emptyTime = Object.values(attendance).some(
      (a) => a.kelgan && !a.kelganVaqti
    )
    if (emptyTime) {
      setErrorMsg("⚠️ Kelgan o‘quvchilarning vaqtini kiriting.")
      return
    }

    setSaving(true)
    try {
      const kelganStudents = Object.entries(attendance)
        .filter(([_, val]) => val.kelgan)
        .map(([id]) => id)

      const body = {
        lessonId: selectedLessonId,
        studentId: kelganStudents,
        kelgan: true,
        kelganVaqti: new Date().toISOString(),
        isDeleted: false,
      }

      console.log("Yuborilayotgan ma’lumot:", body)

      const res = await Attendentionals.createAttendentional(body)
      console.log("Saqlangan:", res)
      alert("✅ Davomat muvaffaqiyatli saqlandi!")
    } catch (err) {
      console.error("❌ Saqlashda xatolik:", err)
      setErrorMsg("Davomatni saqlashda xatolik yuz berdi.")
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    handleFetchStudents()
  }, [selectedLessonId, selectedGroupId])

  if (loading)
    return <p className="text-center text-gray-500 py-8">⏳ O‘quvchilar yuklanmoqda...</p>

  if (!students.length)
    return <p className="text-center text-gray-500 py-8">Hech qanday o‘quvchi topilmadi.</p>

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-blue-600 mb-4 text-center">
        Davomat boshqaruvi
      </h2>

      {errorMsg && (
        <div className="bg-red-100 border border-red-400 text-red-600 px-4 py-2 rounded mb-4 text-center">
          {errorMsg}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-xl shadow-sm">
          <thead className="bg-blue-50 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Ism Familiya</th>
              <th className="px-4 py-2 text-left">Telefon</th>
              <th className="px-4 py-2 text-center">Kelgan</th>
              <th className="px-4 py-2 text-center">Kelgan vaqti</th>
              <th className="px-4 py-2 text-center">Faol</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr
                key={s.id}
                className="border-t hover:bg-blue-50 transition-colors"
              >
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2 font-medium">{s.user.fullName}</td>
                <td className="px-4 py-2 text-gray-600">{s.user.phone}</td>

                {/* ✅ Kelgan Checkbox */}
                <td className="px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={attendance[s.id]?.kelgan || false}
                    onChange={(e) =>
                      setAttendance((prev) => ({
                        ...prev,
                        [s.id]: {
                          ...prev[s.id],
                          kelgan: e.target.checked,
                          kelganVaqti: e.target.checked
                            ? new Date().toISOString().slice(0, 16)
                            : "",
                        },
                      }))
                    }
                    className="w-5 h-5 accent-blue-500"
                  />
                </td>

                {/* 🕒 Kelgan vaqti */}
                <td className="px-4 py-2 text-center">
                  <input
                    type="datetime-local"
                    value={attendance[s.id]?.kelganVaqti || ""}
                    disabled={!attendance[s.id]?.kelgan}
                    onChange={(e) =>
                      setAttendance((prev) => ({
                        ...prev,
                        [s.id]: {
                          ...prev[s.id],
                          kelganVaqti: e.target.value,
                        },
                      }))
                    }
                    className="border rounded px-2 py-1 text-sm disabled:bg-gray-100"
                  />
                </td>

                {/* ❌ isDeleted */}
                <td className="px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={attendance[s.id]?.isDeleted || false}
                    onChange={(e) =>
                      setAttendance((prev) => ({
                        ...prev,
                        [s.id]: {
                          ...prev[s.id],
                          isDeleted: e.target.checked,
                        },
                      }))
                    }
                    className="w-5 h-5 accent-red-500"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={handleSaveAttendance}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow transition disabled:bg-gray-400"
        >
          {saving ? "Saqlanmoqda..." : "💾 Saqlash"}
        </button>
      </div>
      <AddAttendense/>
    </div>
  )
}

export default LessonPage
