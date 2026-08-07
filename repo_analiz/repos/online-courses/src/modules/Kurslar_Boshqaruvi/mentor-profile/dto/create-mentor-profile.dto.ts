import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMentorProfileDto {
  @ApiPropertyOptional({ example: '10 yillik tajriba bilan web dasturchi' })
  @IsOptional()
  @IsString()
  about?: string;

  @ApiPropertyOptional({ example: 'Senior Backend Developer' })
  @IsOptional()
  @IsString()
  job?: string;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsInt()
  @Min(0)
  experience?: number;

  @ApiPropertyOptional({ example: 'https://t.me/mentor_akbar' })
  @IsOptional()
  @IsString()
  telegram?: string;

  @ApiPropertyOptional({ example: 'https://instagram.com/mentor_akbar' })
  @IsOptional()
  @IsString()
  instagram?: string;

  @ApiPropertyOptional({ example: 'https://linkedin.com/in/mentor-akbar' })
  @IsOptional()
  @IsString()
  linkedin?: string;

  @ApiPropertyOptional({ example: 'https://facebook.com/mentor.akbar' })
  @IsOptional()
  @IsString()
  facebook?: string;

  @ApiPropertyOptional({ example: 'https://github.com/mentor-akbar' })
  @IsOptional()
  @IsString()
  github?: string;

  @ApiPropertyOptional({ example: 'https://mentor-akbar.dev' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({
    example: '64dfe3cbb3c5f913adc0e4b9',
    description: 'Foydalanuvchi ID (userId) - mentor kimga tegishli',
  })
  @IsString()
  userId: string;
}
