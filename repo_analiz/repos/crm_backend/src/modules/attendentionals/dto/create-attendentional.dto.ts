import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

class AttendanceItemDto {
  @ApiProperty({
    example: '3c0f817b-de41-4087-8c9c-c66bea445f69',
    description: 'Student (staff) ID who attended the lesson',
  })
  @IsString()
  studentId: string

  @ApiProperty({
    example: '2025-10-21T20:08:34.806Z',
    description: 'The exact time when the student attended the lesson',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  kelganVaqti?: string

  @ApiProperty({
    example: true,
    description: 'Whether the student has attended the lesson',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  kelgan?: boolean

  @ApiProperty({
    example: false,
    description: 'Soft delete flag (optional)',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean
}

export class AttendanceDto {
  @ApiProperty({
    example: '3c0f817b-de41-4087-8c9c-c66bea445f69',
    description: 'Student (staff) ID who attended the lesson',
  })
  @IsString()
  studentIds: string[]

  @ApiProperty({
    example: '6d8ffbd5-5a81-4627-824a-a11ada76de0c',
    description: 'Lesson ID to which this attendance belongs',
  })
  @IsString()
  lessonId: string
}

export class CreateAttendentionalDto {
  @ApiProperty({
    example: '6d8ffbd5-5a81-4627-824a-a11ada76de0c',
    description: 'Lesson ID to which this attendance belongs',
  })
  @IsString()
  lessonId: string

  @ApiProperty({
    type: [AttendanceItemDto],
    description: 'List of attendance records for students',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceItemDto)
  attendances: AttendanceItemDto[]
}


