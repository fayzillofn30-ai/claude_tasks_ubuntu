import { api } from "@/lib/axios"
import { Lesson } from "./types"

/**
 * 🔹 Barcha aktiv darslarni olish
 */
export const getAllLessons = async (): Promise<Lesson[]> => {
  const res = await api.get("/lessons/get-all")
  return res.data.lessons
}

/**
 * 🔹 Bitta darsni olish (lessonId bo‘yicha)
 */
export const getLessonById = async (id: string): Promise<Lesson> => {
  const res = await api.get(`/lessons/get-one/by-lessonid/${id}`)
  return res.data.lesson
}

/**
 * 🔹 Guruh bo‘yicha darslarni olish
 */
export const getLessonsByGroupId = async (groupId: string): Promise<Lesson[]> => {
  const res = await api.get(`/lessons/get-all/by-groupid/${groupId}`)
  return res.data.lessons
}

/**
 * 🔹 Dars yaratish
 */
export const createLesson = async (data: any): Promise<Lesson> => {
  const res = await api.post("/lessons/create", data)
  return res.data.lesson
}

/**
 * 🔹 Darsni yangilash
 */
export const updateLesson = async (id: string, data: any): Promise<Lesson> => {
  const res = await api.patch(`/lessons/update-one/by-lessonid/${id}`, data)
  return res.data.lesson
}

/**
 * 🔹 Darsni o‘chirish (soft delete)
 */
export const deleteLesson = async (id: string): Promise<Lesson> => {
  const res = await api.delete(`/lessons/delete-one/by-lessonid/${id}`)
  return res.data.lesson
}
