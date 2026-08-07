"use client"

import React, { useEffect, useState } from 'react'
import { Group, Lesson } from '@/types'
import { Lessons, Staffs } from '@/features'
import { useAllFetchedData } from '@/lib/ui.state'
import { Button } from '@mui/material'

interface CreateLessonProps {
  group: Group
  setModal: React.Dispatch<React.SetStateAction<boolean>>
  setLessons: React.Dispatch<React.SetStateAction<Lesson[]>>
}

function CreateLesson({ props }: { props: CreateLessonProps }) {
  const { group, setModal, setLessons } = props

  const [teachers, setTeachers] = useState<any[]>([])
  const [selectedTeacher, setSelectedTeacher] = useState<string>("")
  const [date, setDate] = useState("") // YYYY-MM-DD
  const [hour, setHour] = useState<string>("08")
  const [minute, setMinute] = useState<string>("00")
  const [showTimeSelect, setShowTimeSelect] = useState(false)
  const [startDate, setStartDate] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("") // 🔴 yangi holat

  const { teachers: AllTeachers } = useAllFetchedData()

  // === FETCH ALL TEACHERS ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (AllTeachers && AllTeachers.length > 0) {
          setTeachers(AllTeachers)
          return
        }
        setLoading(true)
        const teachersData = await Staffs.getAllTeachers()
        setTeachers(teachersData)
      } catch (err) {
        console.error("Error fetching teachers:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // === TIME CONFIRM ===
  const handleTimeConfirm = () => {
    if (!date || !hour || !minute) {
      setError("Iltimos, sana va vaqtni to‘liq tanlang!")
      return
    }
    const combined = new Date(`${date}T${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:00`)
    setStartDate(combined.toISOString())
    setShowTimeSelect(false)
    setError("") // vaqt tanlansa, errorni tozalaymiz
  }

  // === SUBMIT ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("") // har safar form yuborilishidan oldin tozalaymiz

    try {
      if (!selectedTeacher || !startDate) {
        setError("Iltimos, o‘qituvchi va vaqtni tanlang!")
        return
      }

      setLoading(true)
      const payload = {
        groupId: group.id,
        startDate,
        teacherId: selectedTeacher,
      }

      const res = await Lessons.createLesson(payload)
      setLessons(prev => [...prev, res as Lesson])
      setSelectedTeacher("")
      setStartDate("")
      setModal(false)
    } catch (err: any) {
      console.error(err)
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Xatolik yuz berdi! Iltimos, qayta urinib ko‘ring."
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  // === Soatlar va minutlar massivlari ===
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = [0, 15, 30, 45]

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4 mt-10"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">🧑‍🏫 Yangi Dars Yaratish</h2>
        <Button onClick={() => setModal(false)} color="error">x</Button>
      </div>

      {/* Teacher select */}
      <div>
        <label className="block text-sm font-medium mb-1">O‘qituvchi</label>
        <select
          value={selectedTeacher}
          onChange={(e) => setSelectedTeacher(e.target.value)}
          className="border rounded-lg w-full p-2"
        >
          <option value="">Tanlang</option>
          {teachers.map((teacher: any) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.user.fullName}
            </option>
          ))}
        </select>
      </div>

      {/* Date input */}
      <div>
        <label className="block text-sm font-medium mb-1">Sana</label>
        <input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value)
            setShowTimeSelect(true)
          }}
          className="border rounded-lg w-full p-2"
        />
      </div>

      {/* Time select */}
      {showTimeSelect && (
        <div className="bg-gray-50 border p-3 rounded-lg">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Soat</label>
              <select
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                className="border rounded-lg w-full p-2"
              >
                <option value="">Soat</option>
                {hours.map(h => (
                  <option key={h} value={h}>{h.toString().padStart(2, "0")}</option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Minut</label>
              <select
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                className="border rounded-lg w-full p-2"
              >
                <option value="">Minut</option>
                {minutes.map(m => (
                  <option key={m} value={m}>{m.toString().padStart(2, "0")}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={handleTimeConfirm}
              className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded-lg transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {startDate && (
        <div className="text-sm text-gray-600">
          <p>🕒 Tanlangan vaqt: <span className="font-semibold">{new Date(startDate).toLocaleString()}</span></p>
        </div>
      )}

      {/* 🔴 Error message chiqish joyi */}
      {error && (
        <span className="text-red-600 text-sm bg-red-50 border border-red-200 p-2 rounded-lg">
          ⚠️ {error}
        </span>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition ${loading ? "opacity-60" : ""}`}
      >
        {loading ? "Yaratilmoqda..." : "Darsni yaratish"}
      </button>
    </form>
  )
}

export default CreateLesson
