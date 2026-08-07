import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsArray } from 'class-validator';
import { Models } from 'src/common/types/auth.types';
import { Action } from '@prisma/client';

export class UpdatePermissionDto {
  @ApiPropertyOptional({ example: Models.COURSE, enum: Models })
  @IsOptional()
  @IsEnum(Models)
  model?: Models;

  @ApiPropertyOptional({
    example: [Action.GET, Action.POST],
    enum: Action,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(Action, { each: true })
  actions?: Action[];

  @ApiPropertyOptional({
    example: '60f1b5c3e13f4a001c4e2b1a',
    description: 'Foydalanuvchi IDsi',
  })
  @IsOptional()
  @IsString()
  userId?: string;
}
