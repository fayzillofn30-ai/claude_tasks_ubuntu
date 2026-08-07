import { RoleStafs, Staff } from "@prisma/client"


export  type UserReturnType = {
    "id": string,
    "email": string,
    "phone": string,
    "firstName": string,
    "lastName": string,
    "father": string,
    "image": string,
    "birthDay": Date,
    "isDeleted": boolean,
    "createdAt": string,
    Staff : Staff
  }


export  const UserFindEntitiy = {
    "id": true,
    "email": true,
    "phone": true,
    "firstName": true,
    "lastName": true,
    "father": true,
    "image": true,
    "birthDay": true,
    "isDeleted": true,
    "createdAt": true,
    Staff : true
  }