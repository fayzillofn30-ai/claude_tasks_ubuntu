import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateStudentGroupDto {
  @ApiProperty({ example: "student-uuid" })
  @IsString()
  studentId: string;

  @ApiProperty({ example: "group-uuid" })
  @IsString()
  groupId: string;
}
