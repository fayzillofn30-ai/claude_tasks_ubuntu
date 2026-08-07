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

export class CreateCourseDto {
  @ApiProperty({ example: 'Fullstack Dasturlash', description: 'Kurs nomi' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Bu kurs frontend va backendni o‘rgatadi.' })
  @IsNotEmpty()
  @IsString()
  about: string;

  @ApiProperty({ example: 499_000, required: false })
  @Transform((e) => Number(e.value))
  @IsOptional()
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

  @ApiProperty({ enum: CourseLevel, example: CourseLevel.BEGINNER })
  @IsNotEmpty()
  @IsEnum(CourseLevel)
  level: CourseLevel;

  @ApiProperty({ example: false, required: false })
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
  })
  @IsNotEmpty()
  @IsMongoId()
  categoryId: string;

  @ApiProperty({
    example: '687811ae24bc1bbac5e52959',
    description: 'Mentor profili IDsi',
  })
  @IsNotEmpty()
  @IsMongoId()
  mentorId: string;
}
