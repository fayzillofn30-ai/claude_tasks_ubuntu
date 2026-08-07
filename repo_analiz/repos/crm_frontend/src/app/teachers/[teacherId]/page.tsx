"use client"

import { useAllFetchedData } from '@/lib/ui.state'
import { Staff } from '@/types'
import { CircularProgress } from '@mui/material'
import React, { useMemo } from 'react'

interface TeacherParamType {
  params: Promise<{ teacherId: string }>
}

function TeacherPage({ params }: TeacherParamType) {
  const { teacherId } = React.use(params)
  const { teachers, loading, error } = useAllFetchedData()

  const teacher: Staff | null = useMemo(() => {
    return teachers && teachers.length > 0
      ? teachers.find(t => t.id === teacherId) || null
      : null
  }, [teachers, teacherId])
  console.log(teacher)
  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <CircularProgress size={120} />
      </div>
    )
  }

  if (!teacher) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <p className="text-gray-600 text-lg">Teacher topilmadi...</p>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center w-full h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md hover:shadow-2xl transition-all duration-300">
        <div className="flex flex-col items-center">
          {/* Avatar */}
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-500 shadow-md">
            <img
              src={
                teacher.user.image
                  ? `http://localhost:15976/${teacher.user.image}`
                  : "https://via.placeholder.com/150"
              }
              alt={teacher.user.fullName}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name & Role */}
          <h2 className="mt-4 text-2xl font-semibold text-gray-800">
            {teacher.user.fullName}
          </h2>
          <p className="text-indigo-500 font-medium">{teacher.role}</p>

          {/* Info section */}
          <div className="mt-4 w-full border-t border-gray-200 pt-4 text-sm text-gray-600 space-y-2">
            <p>
              <span className="font-semibold text-gray-700">📧 Email:</span>{" "}
              {teacher.user.email}
            </p>
            <p>
              <span className="font-semibold text-gray-700">📞 Telefon:</span>{" "}
              {teacher.user.phone}
            </p>
            <p>
              <span className="font-semibold text-gray-700">🎂 Tug‘ilgan sana:</span>{" "}
              {teacher.user.birthDay}
            </p>
          </div>

          {/* Button */}
          <div className="mt-6">
            <button className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              Batafsil ma'lumot
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherPage
