import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray, IsEnum } from 'class-validator';
import { Action } from '@prisma/client';
import { Models } from 'src/common/types/auth.types';

export class CreatePermissionDto {
  @ApiProperty({ example: Models.COURSE, enum: Models })
  @IsNotEmpty()
  @IsEnum(Models)
  model: Models;

  @ApiProperty({
    example: [Action.GET, Action.POST],
    isArray: true,
    enum: Action,
  })
  @IsArray()
  @IsEnum(Action, { each: true })
  actions: Action[];

  @ApiProperty({
    example: '60f1b5c3e13f4a001c4e2b1a',
    description: 'Foydalanuvchi IDsi',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
