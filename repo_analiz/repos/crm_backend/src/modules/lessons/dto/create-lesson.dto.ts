import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsInt, IsString, Min } from "class-validator";

export class CreateLessonDto {
  @ApiProperty({ example: "3552e666-a0dc-485c-b249-b4e8e70a01ac" })
  @IsString()
  groupId: string;

  @ApiProperty({ example: "2c4cafe9-2e1c-4998-8170-2ce3e04107fe" })
  @IsString()
  teacherId: string;

  @ApiProperty({ example: "2025-10-20T08:00:00.000Z" })
  @IsDateString()
  startDate: Date;
}
