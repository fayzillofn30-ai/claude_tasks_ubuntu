import { IsNotEmpty, IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateAssisgnedCourseDto {
    @ApiProperty({example : "687808bfa23bc1953a734608"})
    @IsString()
    @IsNotEmpty()
    userId : string

    @ApiProperty({example : "68781cdecccaff9285305f11"})
    @IsString()
    @IsString()
    courseId : string
}
/*
model AssignedCourse {
  id     String @id @default(auto()) @map("_id") @db.ObjectId
  userId String @db.ObjectId
  user   User   @relation(fields: [userId], references: [id])

  courseId String @db.ObjectId
  courses  Course @relation(fields: [courseId], references: [id])

  updatedAt DateTime @default(now())
  createdAt DateTime @default(now())

  @@map("assisgned_courses")
}

*/