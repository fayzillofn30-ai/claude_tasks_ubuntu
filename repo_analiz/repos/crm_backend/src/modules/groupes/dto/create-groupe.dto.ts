import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDateString, IsString } from "class-validator";

export class CreateGroupeDto {

  @ApiProperty({ example: "Group name" })
  @IsString()
  name: string;

  @ApiProperty({ example: "0e1d34a7-d601-49c0-8be3-830f996047db" })
  @IsString()
  teacherId: string;

  @ApiProperty({ example: "4f3a3bf8-bfe1-4bbe-b575-95a8f72c1741" })
  @IsString()
  courseId: string;

  @ApiProperty({ example: "786e766a-3469-4604-b659-fbe5ce927157" })
  @IsString()
  romId: string;
  
  @ApiProperty({ example: false, default: false })
  @IsBoolean()
  isEnd: boolean = false;

  @ApiProperty({ example: false, default: false })
  @IsBoolean()
  isStart: boolean = false;

  @ApiProperty({ example: "2025-10-20T08:00:00Z" })
  @IsDateString()
  startDate: string;
}
