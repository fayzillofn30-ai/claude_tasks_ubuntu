// User model (staff ichida mavjud)
export interface UserType {
  id: string
  fullName: string
  firstName : string
  lastName : string
  email: string
  phone: string
  image: string | null
  birthDay: string
  isDeleted: boolean
}

// Staff model (asosiy)
export interface StaffType {
  id: string
  role: "ADMIN" | "TEACHER" | "ASISTANT" | "STUDENT"
  user: UserType
  isDeleted: boolean
}

// API javobi — umumiy holda
export interface StaffListResponse {
  count: number
  staffs: StaffType[]
}

// O‘qituvchilar uchun javob
export interface TeachersByGroupResponse extends StaffListResponse {}
export interface TeachersByCourseResponse extends StaffListResponse {}

// O‘quvchilar uchun javob
export interface StudentsByGroupResponse extends StaffListResponse {}
export interface StudentsByCourseResponse extends StaffListResponse {}

// Bitta staff (teacher yoki student)
export interface OneStaffResponse {
  staff: StaffType
}
