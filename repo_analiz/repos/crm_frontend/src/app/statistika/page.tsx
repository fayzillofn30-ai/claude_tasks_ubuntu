"use client"

import { useAllFetchedData } from '@/lib/ui.state'
import React from 'react'
import { People, School, Group, Book, MeetingRoom, Schedule } from '@mui/icons-material'

function Statistika() {
  const { students, teachers, groupes, courses, rooms, lessons } = useAllFetchedData()

  const stats = [
    {
      title: "O‘quvchilar",
      value: students.length,
      icon: <People className="text-blue-500" />,
      bg: "bg-blue-50"
    },
    {
      title: "O‘qituvchilar",
      value: teachers.length,
      icon: <School className="text-green-500" />,
      bg: "bg-green-50"
    },
    {
      title: "Guruhlar",
      value: groupes.length,
      icon: <Group className="text-purple-500" />,
      bg: "bg-purple-50"
    },
    {
      title: "Kurslar",
      value: courses.length,
      icon: <Book className="text-yellow-500" />,
      bg: "bg-yellow-50"
    },
    {
      title: "Xonalar",
      value: rooms.length,
      icon: <MeetingRoom className="text-pink-500" />,
      bg: "bg-pink-50"
    },
    {
      title: "Darslar",
      value: lessons.length,
      icon: <Schedule className="text-indigo-500" />,
      bg: "bg-indigo-50"
    },
  ]

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">📊 Umumiy Statistika</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bg} p-5 rounded-xl shadow hover:shadow-lg transition`}
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">{stat.icon}</div>
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <h3 className="text-xl font-bold">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Statistika
