import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Frontend',
    description: 'Kurs kategoriyasi nomi',
  })
  @IsNotEmpty({ message: 'Kategoriya nomi bo‘sh bo‘lishi mumkin emas' })
  @IsString({ message: 'Kategoriya nomi matn bo‘lishi kerak' })
  name: string;
}
