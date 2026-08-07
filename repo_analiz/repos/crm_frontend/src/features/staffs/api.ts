import api from "@/lib/axios"
import { Staff } from "@/types"

// 🔹 Barcha stafflarni olish
export const getAllStaffs = async () => {
  const res = await api.get("/staffs/get-all/staffs")
  return res.data
}

// 🔹 Guruhdagi o‘qituvchilarni olish
export const getTeachersByGroupId = async (groupId: string) => {
  const res = await api.get(`/staffs/get-all/teacher/by-groupid/${groupId}`)
  return res.data
}

// 🔹 Kursdagi o‘qituvchilarni olish
export const getTeachersByCourseId = async (courseId: string) => {
  const res = await api.get(`/staffs/get-all/teacher/by-courseid/${courseId}`)
  return res.data
}

// 🔹 Guruhdagi o‘quvchilarni olish
export const getStudentsByGroupId = async (groupId: string) : Promise<Staff[]> => {
  const res = await api.get<{students : Staff[]}>(`/staffs/get-all/studet/by-groupid/${groupId}`)
  return res.data.students
}

// 🔹 Kursdagi o‘quvchilarni olish
export const getStudentsByCourseId = async (courseId: string) => {
  const res = await api.get(`/staffs/get-all/student/by-courseid/${courseId}`)
  return res.data
}

// 🔹 Bitta o‘qituvchi ma’lumotini olish (staffId orqali)
export const getOneTeacherByStaffId = async (id: string) => {
  const res = await api.get(`/staffs/get-one/teacher/by-staffid/${id}`)
  return res.data
}

// 🔹 Bitta staffni (o‘qituvchi yoki o‘quvchi) olish
export const getOneStaffById = async (id: string) => {
  const res = await api.get(`/staffs/get-one/by-staffid/${id}`)
  return res.data
}


export const getAllStudents = async () => {
  const {data} = await api.get("staffs/get-all/students")
  return data.students
}
export const getAllTeachers = async () => {
  const {data} = await api.get("staffs/get-all/teachers")
  return data.teachers
}