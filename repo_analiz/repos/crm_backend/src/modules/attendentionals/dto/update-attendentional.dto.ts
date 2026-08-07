import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateAttendentionalDto {
  @ApiPropertyOptional({
    example: '6d8ffbd5-5a81-4627-824a-a11ada76de0c',
    description: 'Lesson ID to which this attendance belongs',
  })
  @IsOptional()
  @IsString()
  lessonId?: string;

  @ApiPropertyOptional({
    example: '9a4b2c37-23fa-44f2-9f2b-2b9d6fa8c12d',
    description: 'Student (staff) ID who is attending the lesson',
  })
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiPropertyOptional({
    example: '2025-10-20T09:45:00.000Z',
    description: 'The exact time when the student attended the lesson',
  })
  @IsOptional()
  @IsDateString()
  kelganVaqti?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the student has attended the lesson',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  kelgan?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Soft delete flag',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}
