import { Course, Group, GroupPayment, Rom, Staff } from "@prisma/client";
import { RoleStafs } from "src/modules/users/dto/create-user.dto";
import {UserFindEntitiy,UserReturnType } from "src/modules/users/entities/user.entity";


type GroupeType = {
  "id": "6d8ffbd5-5a81-4627-824a-a11ada76de0c",
  "name": "Group name",
  "courseId": "4f3a3bf8-bfe1-4bbe-b575-95a8f72c1741",
  "isEnd": false,
  "isStart": false,
  "romId": "786e766a-3469-4604-b659-fbe5ce927157",
  "startDate": "2025-10-20T08:00:00.000Z",
  "teacherId": "0e1d34a7-d601-49c0-8be3-830f996047db",
  "_count": {
    "students": 0,
    "Lesson": 0,
    "GroupPayment": 0
  },
  "teacher": UserReturnType,
  "course": Course,
  "rom": Rom,
  "students": UserReturnType[],
  "GroupPayment": GroupPayment[]
}

const target =  {
        id: true,
        name: true,
        courseId: true,
        isEnd: true,
        isStart: true,
        romId: true,
        startDate: true,
        teacherId: true,
        _count: {
          select: {
            students: true,
            Lesson: true,
            GroupPayment: true
          }
        },
        teacher: {
          include : {user : {
            select : UserFindEntitiy
          }}
        },
        course: true,
        rom: true,
        students: {
          select: {
            "id": true,
            studentId : true,
            student: {
              select: {
                user: {
                  select: {
                    "email": true,
                    "phone": true,
                    "firstName": true,
                    "lastName": true,
                    "father": true,
                    "image": true,
                    "birthDay": true,
                    "isDeleted": true,
                    "createdAt": true,
                  }
                }
              }
            }
          }
        },
        GroupPayment: {
          include : {
            student : {
              include : {
                user : {
                  select : {
                    "email": true,
                    "phone": true,
                    "firstName": true,
                    "lastName": true,
                    "father": true,
                    "image": true,
                    "birthDay": true,
                    "isDeleted": true,
                    "createdAt": true,
                  }
                }
              }
            }
          }
        }
      }

export const groupFindEntity = {
  id: true,
  name: true,
  courseId: true,
  isEnd: true,
  isStart: true,
  romId: true,
  startDate: true,
  teacherId: true,
  _count: {
    select: {
      students: true,
      Lesson: true,
      GroupPayment: true
    }
  },
  teacher: true,
  course: true,
  rom: true,
  students: {
          select: {
            "id": true,
            studentId : true,
            student: {
              select: {
                user: {
                  select: {
                    "email": true,
                    "phone": true,
                    "firstName": true,
                    "lastName": true,
                    "father": true,
                    "image": true,
                    "birthDay": true,
                    "isDeleted": true,
                    "createdAt": true,
                  }
                }
              }
            }
          }
        },
  GroupPayment: true
}

export const groupReturnData = (group: GroupeType) => {
  const {teacher,students,course,GroupPayment,_count,rom} = group
  const {id,name,isEnd,isStart,startDate,courseId,teacherId,romId,} = group
  const {firstName,lastName,email,phone,father,birthDay,image,isDeleted,createdAt} = teacher
  const studentsData = students.map(student => {
    const {birthDay,createdAt,email,father,firstName,id,image,isDeleted,lastName,phone,Staff : {role,id :staffId,userId}} = student
    return {
      studentId : id,
      firstName,lastName,email,image,father,isDeleted,phone,role
    }
  }) 
  const {durationMinut,durationMont,image : courseLogo,name : courseNmae,price,published,weekDays} = course
  const {name : romName , pleaces,isOpen, romNumber} = rom
}