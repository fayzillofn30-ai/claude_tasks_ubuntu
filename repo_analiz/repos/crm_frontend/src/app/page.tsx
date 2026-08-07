"use client"

import React, { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAllFetchedData } from "@/lib/ui.state"
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export default function Home() {
  const { fetchAll, loading, error, ...allData } = useAllFetchedData()

  useEffect(() => {
    fetchAll()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg font-medium">Yuklanmoqda...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500 font-medium">
          Ma'lumotlarni yuklashda xatolik yuz berdi!
        </p>
      </div>
    )
  }

  const { courses = [], groupes = [], lessons = [] } = allData

  // 1️⃣ Har bir kursdagi guruhlar soni
  const courseStats = courses.map((course: any) => ({
    name: course.name,
    value: groupes.filter((g: any) => g.courseId === course.id).length,
  }))

  // 2️⃣ Har bir guruhdagi darslar soni
  const groupStats = groupes.map((g: any) => ({
    name: g.name,
    value: lessons.filter((l: any) => l.groupId === g.id).length,
  }))

  // 3️⃣ Har bir darsdagi davomat soni
  const lessonStats = lessons.map((l: any) => ({
    name: `${l.groupName} #${l.lessonNumber}`,
    value: l.attendCount || 0,
  }))

  return (
    <div className="flex flex-col gap-8 py-6 w-full">
      {/* 1️⃣ Kurslar bo‘yicha guruhlar soni */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">📚 Kurslar bo‘yicha guruhlar soni</CardTitle>
        </CardHeader>
        <CardContent className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={courseStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 2️⃣ Guruhlar bo‘yicha darslar soni */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">🏫 Guruhlar bo‘yicha darslar soni</CardTitle>
        </CardHeader>
        <CardContent className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={groupStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 3️⃣ Darslar bo‘yicha davomat statistikasi */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">🧾 Darslar bo‘yicha davomat statistikasi</CardTitle>
        </CardHeader>
        <CardContent className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={lessonStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
