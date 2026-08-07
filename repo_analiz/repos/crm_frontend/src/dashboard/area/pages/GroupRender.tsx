"use client"

import React from "react"
import { useAllFetchedData, useSelectedStore } from "@/lib/ui.state"
import LessonsRender from "../../../src/components/render/LessonsRender"

function GroupeRender() {
  const { selectedGroupId, setGroupId } = useSelectedStore()
  const { groupes, error, loading } = useAllFetchedData()

  if (loading) return <p className="text-center text-gray-500">⏳ Guruhlar yuklanmoqda...</p>
  if (error) return <p className="text-center text-red-500">Xatolik yuz berdi: {error}</p>
  if (!selectedGroupId) return <p className="text-center text-gray-500">Hech qanday guruh tanlanmagan.</p>

  const selectedGroup = groupes?.find((g: any) => g.id === selectedGroupId)
  if (!selectedGroup) return <p className="text-center text-gray-500">Tanlangan guruh topilmadi.</p>



  return (
    <div className="flex justify-center p-4">
      <div className="relative bg-white shadow-lg rounded-2xl p-6 w-full max-w-md border border-blue-500">
        {/* 🔘 CLOSE tugmasi */}
        <button
          onClick={() => setGroupId(null)}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition-colors"
          title="Yopish"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-blue-600 text-center mb-4">
          {selectedGroup.name}
        </h2>

        <div className="space-y-2 text-gray-700">
          <p><span className="font-medium">Kurs:</span> {selectedGroup.courseName}</p>
          <p><span className="font-medium">O‘qituvchi:</span> {selectedGroup.teacherFirstName} {selectedGroup.teacherLastName}</p>
          <p><span className="font-medium">Telefon:</span> {selectedGroup.teacherPhone}</p>
          <p><span className="font-medium">Xona:</span> {selectedGroup.romName} #{selectedGroup.romNumber}</p>
          <p><span className="font-medium">Narx:</span> {selectedGroup.coursePrice.toLocaleString()} so‘m</p>
          <p><span className="font-medium">O‘quvchilar:</span> {selectedGroup.studentCount}</p>
          <p><span className="font-medium">Darslar:</span> {selectedGroup.lessonCount}</p>
          <p><span className="font-medium">To‘lovlar:</span> {selectedGroup.paymentCount}</p>
          <p><span className="font-medium">Boshlanish:</span> {new Date(selectedGroup.startDate).toLocaleDateString()}</p>
        </div>

        <div
          className={`mt-4 text-center font-semibold ${
            selectedGroup.isEnd
              ? "text-red-500"
              : selectedGroup.isStart
              ? "text-green-500"
              : "text-orange-500"
          }`}
        >
          {selectedGroup.isEnd
            ? "🔴 Tugagan"
            : selectedGroup.isStart
            ? "🟢 Boshlangan"
            : "🟠 Boshlanmagan"}
        </div>
      </div>
      <div>
        <LessonsRender/>
      </div>
    </div>
  )
}

export default GroupeRender
