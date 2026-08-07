export type studentGroupresponseType = {
  "message": "This action adds a new studentGroup",
  "studentGroup": {
    "id": "d2cec682-f8da-44a4-8fd5-590d72ed7cb1",
    "studentId": "6448a535-981a-4271-953e-76ce532e9580",
    "groupId": "dc9d567c-ad48-41d2-82e8-1b8c8a3764d8",
    "isDeleted": false,
    "student": {
      "id": "6448a535-981a-4271-953e-76ce532e9580",
      "userId": "3f3ced62-b4ba-455e-954b-25e7a9fc555f",
      "role": "STUDENT",
      "isDeleted": false,
      "user": {
        "id": "3f3ced62-b4ba-455e-954b-25e7a9fc555f",
        "email": "ovovovlululutvata@gmail.com",
        "phone": "+998992422141",
        "password": "$2b$10$92W.ZkJoQcXR6RIgJUQywOOyu7a6YmN44wf71JWxkIpR4rm65FePu",
        "firstName": "Fayzillo",
        "lastName": "Ummatov",
        "isDeleted": false,
        "createdAt": "2025-10-20T10:12:25.473Z",
        "birthDay": "2025-10-20T00:00:00.000Z",
        "father": "Soliyev Ziyodulla",
        "image": "api/image/1760955145348-704096848.png"
      }
    }
  }
}

export const StudentGroup = {
    "id": "d2cec682-f8da-44a4-8fd5-590d72ed7cb1",
    "studentId": "6448a535-981a-4271-953e-76ce532e9580",
    "groupId": "dc9d567c-ad48-41d2-82e8-1b8c8a3764d8",
    "isDeleted": false,
    "student": {
      "id": "6448a535-981a-4271-953e-76ce532e9580",
      "userId": "3f3ced62-b4ba-455e-954b-25e7a9fc555f",
      "role": "STUDENT",
      "isDeleted": false,
      "user": {
        "id": "3f3ced62-b4ba-455e-954b-25e7a9fc555f",
        "email": "ovovovlululutvata@gmail.com",
        "phone": "+998992422141",
        "password": "$2b$10$92W.ZkJoQcXR6RIgJUQywOOyu7a6YmN44wf71JWxkIpR4rm65FePu",
        "firstName": "Fayzillo",
        "lastName": "Ummatov",
        "isDeleted": false,
        "createdAt": "2025-10-20T10:12:25.473Z",
        "birthDay": "2025-10-20T00:00:00.000Z",
        "father": "Soliyev Ziyodulla",
        "image": "api/image/1760955145348-704096848.png"
      }
    }
  }

export type StudentGroupStats = {
  id: string

  student: {
    id: string
    userId: string
    firstName: string
    lastName: string
    phone: string
    email: string
    birthDay: string
    father: string | null
    image: string | null
    createdAt: string
  }

  group: {
    id: string
    name: string
    startDate: string
    isStart: boolean
    isEnd: boolean
    inActive: boolean

    course: {
      id: string
      name: string
      price: number
    }

    rom: {
      id: string
      name: string
      romNumber: number
    }

    teacher: {
      id: string
      userId: string
      isDeleted: boolean
      role: "ADMIN" | "TEACHER" | "ASISTANT" | "STUDENT"
      user: {
        firstName: string
        lastName: string
        email: string
        phone: string
      }
    }

    lessons: {
      id: string
      groupId: string
      lessonNumber: number
      startDate: string
      endDate: string
      teacherId: string
      isDeleted: boolean
    }[]
  }
}
