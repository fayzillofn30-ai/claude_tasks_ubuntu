import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsMongoId,
} from 'class-validator';
import { CourseLevel } from '@prisma/client';
import { Transform } from 'class-transformer';

export class UpdateCourseDto {
  @ApiProperty({
    example: 'Fullstack Dasturlash',
    description: 'Kurs nomi',
    required: false,
  })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'Bu kurs frontend va backendni orgatadi.',
    required: false,
  })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsString()
  about?: string;

  @ApiProperty({ example: 499_000, required: false })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @Transform((e) => Number(e.value))
  @IsNumber()
  price?: number;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Banner fayl (jpg, png...)',
  })
  @IsOptional()
  banner?: any;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Intro video fayl (mp4...)',
  })
  @IsOptional()
  introVideo?: any;

  @ApiProperty({
    enum: CourseLevel,
    example: CourseLevel.BEGINNER,
    required: false,
  })
  @IsOptional()
  //   @IsEnum(CourseLevel)
  level?: CourseLevel;

  @ApiProperty({ example: false, required: false })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @Transform((e) => {
    console.log(e.value);
    return false;
  })
  @IsBoolean()
  published?: boolean;

  @ApiProperty({
    example: '6878085ba23bc1953a734606',
    description: 'Kategoriya IDsi',
    required: false,
  })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsMongoId()
  categoryId?: string;

  @ApiProperty({
    example: '687808bfa23bc1953a734608',
    description: 'Mentor profili IDsi',
    required: false,
  })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsMongoId()
  mentorId?: string;
}
