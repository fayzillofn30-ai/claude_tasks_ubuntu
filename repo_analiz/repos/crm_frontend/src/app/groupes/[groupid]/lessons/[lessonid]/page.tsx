"use client"

import { useAllFetchedData, useSelectedStore } from "@/lib/ui.state"
import { Lesson, Staff } from "@/types"
import React, { useEffect, useMemo, useState } from "react"
import { CircularProgress } from "@mui/material"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Lessons, Staffs } from "@/features"
import CreateAttendence from "@/components/modal/CreateAttendence"

interface LessonPageParamsType {
  params: { lessonid: string }
}

function LessonPage({ params }: LessonPageParamsType) {
  const { lessonid } = params
  const router = useRouter()

  const { lessons, error: LessonsError, loading: LessonsLoading } = useAllFetchedData()
  const { selectedGroupId } = useSelectedStore()

  const [students, setStudents] = useState<Staff[]>([])
  const [loadingStudents, setLoadingStudents] = useState(true)
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loadingLesson, setLoadingLesson] = useState(true)

  // === 1️⃣ Dastlab store'dan darsni topish ===
  const cachedLesson = useMemo(() => {
    return lessons.find((l) => l.id === lessonid)
  }, [lessons, lessonid])

  // === 2️⃣ Darsni olish (agar localda bo‘lmasa API orqali) ===
  const fetchLesson = async () => {
    try {
      setLoadingLesson(true)
      if (cachedLesson) {
        setLesson(cachedLesson)
      } else {
        console.log("API orqali lesson olish:", lessonid)
        const data = await Lessons.getLessonById(lessonid)
        setLesson(data)
      }
    } catch (error) {
      console.error("❌ Lesson olishda xatolik:", error)
    } finally {
      setLoadingLesson(false)
    }
  }

  // === 3️⃣ Talabalarni olish ===
  const fetchStudents = async () => {
    if (!selectedGroupId) {
      setLoadingStudents(false)
      return
    }
    try {
      setLoadingStudents(true)
      const res = await Staffs.getStudentsByGroupId(selectedGroupId)
      setStudents(res)
    } catch (error) {
      console.error("Talabalarni olishda xatolik:", error)
    } finally {
      setLoadingStudents(false)
    }
  }

  // === 4️⃣ Yuklash effekti ===
  useEffect(() => {
    fetchLesson()
  }, [lessonid, lessons])

  useEffect(() => {
    fetchStudents()
  }, [lessonid, selectedGroupId])

  // === 5️⃣ Error yoki yuklanish holatlari ===
  if (LessonsError)
    return <h1 className="text-center text-red-500 mt-10">❌ Lesson yuklashda xatolik!</h1>

  if (loadingLesson)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        <CircularProgress size={80} />
        <p className="ml-3 text-lg">Dars ma’lumotlari yuklanmoqda...</p>
      </div>
    )

  if (!lesson)
    return (
      <div className="flex flex-col items-center mt-10 text-gray-700">
        <p className="text-lg font-medium">❌ Dars topilmadi</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Ortga qaytish
        </button>
      </div>
    )

  // === 6️⃣ Render qismi ===
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-10 px-4 space-y-6">
      {/* Dars tafsilotlari */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-5xl relative">
        {/* Ortga qaytish */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
        >
          <ArrowLeft className="w-5 h-5" /> Ortga
        </button>

        {/* Header */}
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          🧾 Dars tafsilotlari
        </h1>

        {/* Lesson ma’lumotlari */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm text-gray-700 w-full">
          <div>
            <p className="font-medium">📚 Dars raqami:</p>
            <p>{lesson.lessonNumber}</p>
          </div>
          <div>
            <p className="font-medium">👨‍🏫 O‘qituvchi:</p>
            <p>{lesson.teacherName}</p>
          </div>
          <div>
            <p className="font-medium">🏫 Guruh:</p>
            <p>{lesson.groupName}</p>
          </div>
          <div>
            <p className="font-medium">🏠 Xona:</p>
            <p>
              {lesson.roomName} #{lesson.roomNumber}
            </p>
          </div>
          <div>
            <p className="font-medium">🕓 Boshlanish:</p>
            <p>{new Date(lesson.startDate).toLocaleString("uz-UZ")}</p>
          </div>
          <div>
            <p className="font-medium">🕒 Tugash:</p>
            <p>
              {lesson.endDate
                ? new Date(lesson.endDate).toLocaleString("uz-UZ")
                : "–"}
            </p>
          </div>
          <div>
            <p className="font-medium">👥 O‘quvchilar soni:</p>
            <p>{lesson.studentsCount}</p>
          </div>
          <div>
            <p className="font-medium">✅ Davomat qilganlar:</p>
            <p>{lesson.attendCount}</p>
          </div>
          <div>
            <p className="font-medium">📅 Status:</p>
            <p
              className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${
                lesson.isDeleted
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {lesson.isDeleted ? "❌ O‘chirilgan" : "✅ Faol"}
            </p>
          </div>
        </div>
      </div>

      {/* 🎯 Davomat jadvali */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-5xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">✅ Davomat</h2>

        {loadingStudents ? (
          <div className="flex justify-center py-6 text-gray-500">
            <CircularProgress size={50} />
          </div>
        ) : (
          <CreateAttendence lessonId={lessonid} students={students} />
        )}
      </div>
    </div>
  )
}

export default LessonPage
