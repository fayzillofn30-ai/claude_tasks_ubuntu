
export const enum HomeworkSubStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}
export const HomeWorkSubStatusArr = ['PENDING', 'APPROVED', 'REJECTED']


export const enum PaidVia {
  PAYME = 'PAYME',
  CLICK = 'CLICK',
  CASH = 'CASH'
}
export const PaidViaArr = ['PAYME','CLICK','CASH']

export const enum Role {
  ADMIN = 'ADMIN',
  MENTOR = 'MENTOR',
  ASSISTANT  = 'ASSISTANT',
  STUDENT = 'STUDENT'
}

export const enum Action {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

export const enum CourseLevel {
  BEGINNER = 'BEGINNER',
  PRE_INTERMEDIATE = 'PRE_INTERMEDIATE',
  INTERMEDIATE = 'INTERMEDIATE',
  UPPER_INTERMEDIATE = 'UPPER_INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}
export const CourseLevelArr = ['BEGINNER','ADVANCED','UPPER_INTERMEDIATE','INTERMEDIATE','PRE_INTERMEDIATE',]
export const enum ExamAnswer {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D'
}
export const ExamAnswerArr = ['A','B','C','D']
export const enum EmailCodeEnum  {
  REGISTER = "register",
  RESET_PASSWORD = "reset_password",
}