import { PrismaClient, User } from "@prisma/client";

export const userFindOneEntity = {
        id: true, 
        fullName: true, 
        email: true, avatar: true,
         role: true, createdAt: true,
          updatedAt: true,password : false
      }