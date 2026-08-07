"use client"

import { useAllFetchedData, useSelectedStore } from '@/lib/ui.state'
import { Course } from '@/types'
import { Card, CardContent, CardMedia, Typography, IconButton, Chip } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import React, { useEffect, useMemo, useState } from 'react'
import GroupeRender from './GroupRender'
import GroupesRender from '../../../src/components/render/Groupes'

// 🔹 Haftalik kunlarni raqamdan matnga o‘girish
const weekDayNames: Record<number, string> = {
  1: "Dushanba",
  2: "Seshanba",
  3: "Chorshanba",
  4: "Payshanba",
  5: "Juma",
  6: "Shanba",
  0: "Yakshanba",
}

function CoursePage() {
  const { selectedCourseId, setCourseId } = useSelectedStore()
  const { courses,groupes ,fetchAll, error, loading } = useAllFetchedData()
  const [course, setCourse] = useState<Course | null>(null)


  // 🔹 Kurslarni yuklash
  useEffect(() => {
    if (courses.length === 0 && !loading && !error) {
      fetchAll()
    }
  }, [courses, loading, error, fetchAll])

  // 🔹 Tanlangan kursni topish
  useEffect(() => {
    if (!loading && !error) {
      const target = courses.find((cours) => cours.id === selectedCourseId)
      setCourse(target || null)
    }
  }, [courses, selectedCourseId, loading, error])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>
  if (!course) return <p>Course not found</p>

  return (
    <div className="relative w-full mx-auto mt-6">
      {/* 🔘 Close tugmasi */}
      <IconButton
        onClick={() => setCourseId(null)}
        className="absolute top-2 right-2 bg-gray-100 hover:bg-gray-200"
      >
        <CloseIcon />
      </IconButton>

      <Card className="shadow-2xl rounded-xl overflow-hidden flex">
        <CardMedia
          component="img"
          image={`http://localhost:15976/${course.image}`}
          alt={course.name}
          sx={{ height: 250 ,width : 200}}
        />

        <CardContent className="space-y-3">
          <Typography variant="h5" className="font-semibold">
            {course.name}
          </Typography>

          <div className="flex flex-wrap gap-2 items-center">
            <Chip
              label={course.published ? "Nashr etilgan" : "Qoralama"}
              color={course.published ? "success" : "warning"}
              size="small"
            />
            <Chip label={`${course.durationMont} oy`} size="small" />
            <Chip label={`${course.durationMinut} daqiqa`} size="small" />
            <Chip label={`${course.price.toLocaleString()} so‘m`} color="primary" size="small" />
          </div>

          <div>
            <Typography variant="subtitle1" className="font-medium mt-3">
              Mashg‘ulot kunlari:
            </Typography>
            <div className="flex flex-wrap gap-1 mt-1">
              {course.weekDays.sort().map((day) => (
                <span
                  key={day}
                  className="px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded-md border border-blue-200"
                >
                  {weekDayNames[day] ?? day}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <Typography variant="body2" color="text.secondary">
              Bu kurs {course.durationMont} oy davom etadi, har haftada{" "}
              {course.weekDays.length} kun dars o‘tiladi, har biri{" "}
              {course.durationMinut} daqiqa davom etadi.
            </Typography>
          </div>
        </CardContent>
      </Card>
      <div>
        <GroupesRender/>
      </div>
    </div>
  )
}

export default CoursePage
