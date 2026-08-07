"use client"

import React, { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button, CircularProgress } from "@mui/material"
import { Group, Lesson } from "@/types"
import { Groupes, Lessons } from "@/features"
import { useAllFetchedData, useSelectedStore } from "@/lib/ui.state"
import CreateLesson from "@/components/modal/CreateLesson"

export default function LessonsRender({ params }: { params: Promise<{ groupid: string }> }) {
  const router = useRouter()
  const { groupid } = React.use(params)

  // === States ===
  const [group, setGroup] = useState<Group | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const {setGroupId} = useSelectedStore()


  useEffect(() => {
      setGroupId(groupid)
  },[])

  // === Global fetched data ===
  const { groupes } = useAllFetchedData()

  // === Fetch group and lessons ===
  useEffect(() => {
    if (!groupid) return

    const fetchData = async () => {
      try {
        setLoading(true)

        // Guruhni topish (globaldan yoki API’dan)
        let target = groupes.find((g) => g.id === groupid)
        if (!target) {
          target = await Groupes.getOneGroupe(groupid)
        }
        setGroup(target || null)

        // Darslarni olish
        const lessonsData = await Lessons.getLessonsByGroupId(groupid)
        setLessons(lessonsData || [])
      } catch (err) {
        console.error("❌ Darslarni olishda xatolik:", err)
        setError("Darslarni yuklashda xatolik yuz berdi.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [groupid, groupes])

  // === Loading holati ===
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        <CircularProgress size={80} />
        <p className="ml-3 text-lg">Darslar yuklanmoqda...</p>
      </div>
    )
  }

  // === Error holati ===
  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>
  }

  // === Main render ===
  return (
    <div className="overflow-x-auto mt-6 p-4">
      {/* Header */}
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={() => router.push(`/groupes/${groupid}`)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition text-lg font-medium"
        >
          <ArrowLeft className="w-6 h-6" />
          Ortga
        </button>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsOpenModal(true)}
        >
          Yangi dars qo‘shish
        </Button>
      </div>

      {/* Lessons table */}
      {lessons.length > 0 ? (
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Boshlanish</th>
                <th className="px-4 py-2 text-left">Tugash</th>
                <th className="px-4 py-2 text-left">O‘qituvchi</th>
                <th className="px-4 py-2 text-left">Xona</th>
                <th className="px-4 py-2 text-left">O‘quvchilar</th>
              </tr>
            </thead>

            <tbody>
              {lessons.map((lesson) => (
                <tr
                  key={lesson.id}
                  className={`border-t hover:bg-blue-50 transition cursor-pointer ${
                    lesson.isDeleted ? "opacity-60" : ""
                  }`}
                  onClick={() => router.push(`lessons/${lesson.id}`)}
                >
                  <td className="px-4 py-2">{lesson.lessonNumber}</td>
                  <td className="px-4 py-2">
                    {new Date(lesson.startDate).toLocaleString("uz-UZ")}
                  </td>
                  <td className="px-4 py-2">
                    {lesson.endDate
                      ? new Date(lesson.endDate).toLocaleString("uz-UZ")
                      : "-"}
                  </td>
                  <td className="px-4 py-2">{lesson.teacherName || "-"}</td>
                  <td className="px-4 py-2">
                    {lesson.roomName
                      ? `${lesson.roomName} #${lesson.roomNumber}`
                      : "-"}
                  </td>
                  <td className="px-4 py-2 text-center">{lesson.studentsCount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-sm text-gray-600 mt-2 text-right px-4 py-2">
            Jami darslar: {lessons.length}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">📘 Darslar topilmadi.</p>
      )}

      {/* Modal (Create Lesson) */}
      {isOpenModal && group && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative">
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => setIsOpenModal(false)}
              className="absolute top-2 right-2"
            >
              Yopish
            </Button>
            <CreateLesson
              props={{ group, setLessons, setModal: setIsOpenModal }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
