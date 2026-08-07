
export interface Lesson {
  id: string
  lessonNumber: number
  startDate: string
  endDate: string
  isDeleted: boolean
  groupId: string
  groupName: string
  roomName: string
  roomNumber: string | number
  teacherId: string
  teacherName: string
  studentsCount: number
  attendCount: number
}

