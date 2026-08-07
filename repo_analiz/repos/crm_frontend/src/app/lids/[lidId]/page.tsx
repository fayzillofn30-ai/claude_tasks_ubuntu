"use client"

import React, { useEffect, useState } from "react"
import { Groupes, StudentGroupes } from "@/features"
import { StudentGroupStats } from "@/types" // Importing type
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
const target = [
  // Replace this with real data from grps
  {
    "id": "d74c5dce-fda7-4a87-bffd-267083862b34",
    "name": "FN2",
    "startDate": "2025-10-24T21:08:00.000Z",
    "isStart": true,
    "isEnd": false,
    "inActive": true,
    "teacherId": "7c3aee01-e4c3-4421-9a63-9b395009dabe",
    "teacherFirstName": "Alisa",
    "teacherLastName": "Nataliy",
    "teacherPhone": "916102143",
    "courseId": "d4ced44b-d2b8-4380-a9e4-35e5ca8024f3",
    "courseName": "Data Analitika",
    "coursePrice": 1200000,
    "romId": "f50ef263-e4fd-4c61-88b4-391bc1d11755",
    "romName": "Salo",
    "romNumber": 1,
    "lessons": [
      {
        "id": "2299c106-08ec-4b29-ae5e-1e64980291ca",
        "groupId": "d74c5dce-fda7-4a87-bffd-267083862b34",
        "teacherId": "7c3aee01-e4c3-4421-9a63-9b395009dabe",
        "lessonNumber": 1,
        "startDate": "2025-10-25T09:00:00.000Z",
        "endDate": "2025-10-25T11:00:00.000Z",
        "isDeleted": false
      }
    ],
    "studentCount": 2,
    "lessonCount": 1,
    "paymentCount": 0
  },
  // Add more similar objects here...
]
function RoomPage() {
  const params = useParams()
  const lidId = params?.lidId as string
  const router = useRouter()
  const [data, setData] = useState<typeof target>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      // Simulated fetch data
      const grps = await Groupes.getAllByRooId(lidId)
      // In your case, you should use the grps variable for actual fetched data
      setData(grps.groupes)
    } catch (err: any) {
      console.error(err)
      setError("Ma’lumotlarni olishda xatolik yuz berdi.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (lidId) fetchData()
  }, [lidId])

  if (loading) return <div className="p-4 text-gray-500">Yuklanmoqda...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>
  if (!data) return <></>
  return (
    <div className="p-6 space-y-4">
      <div className="mb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition text-lg font-medium"
        >
          <ArrowLeft className="w-6 h-6" />
          Ortga
        </button>
      </div>
      <h1 className="text-xl font-semibold">Xona statistikasi</h1>

      {/* Display room data */}
      {data.length > 0 ? (
        data.map((group) => (
          <div key={group.id} className="p-4 border rounded-lg bg-white shadow-md mb-4">
            <h2 className="text-lg font-semibold text-indigo-600">{group.courseName} - {group.name}</h2>
            <p className="text-sm text-gray-600">
              <b>O‘qituvchi:</b> {group.teacherFirstName} {group.teacherLastName}
            </p>
            <p className="text-sm text-gray-600">
              <b>Telefon:</b> {group.teacherPhone}
            </p>
            <p className="text-sm text-gray-600">
              <b>Talaba soni:</b> {group.studentCount}
            </p>
            <p className="text-sm text-gray-600">
              <b>Darslar soni:</b> {group.lessonCount}
            </p>
            <p className="text-sm text-gray-600">
              <b>To‘lovlar soni:</b> {group.paymentCount}
            </p>
            <p className="text-sm text-gray-600">
              <b>Xona:</b> {group.romName} - {group.romNumber}
            </p>

            {/* Display lessons */}
            <div className="shadow-2xl p-6 ring-pink-700">
              <h3 className="text-sm uppercase font-extrabold">Darslar:</h3>
              <ul className="list-disc flex flex-wrap gap-2">
                {group.lessons.map((lesson) => {
                  let { endDate, groupId, id, isDeleted, lessonNumber, startDate } = lesson
                  startDate = new Date(startDate).toLocaleString("en-US", { year: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }).slice(0, -3)
                  endDate = new Date(endDate).toLocaleString("en-US", { year: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }).slice(0, -3)
                  return (
                    <li key={lesson.id} className="text-sm text-gray-600 border w-max p-2 list-none">
                      <b className="shadow-2xl">Dars {lesson.lessonNumber}</b>
                      <p>{startDate}</p>
                      <p className="shadow-2xl">{endDate}</p>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-600">Xonada guruh mavjud emas.</p>
      )}
    </div>
  )
}

export default RoomPage
