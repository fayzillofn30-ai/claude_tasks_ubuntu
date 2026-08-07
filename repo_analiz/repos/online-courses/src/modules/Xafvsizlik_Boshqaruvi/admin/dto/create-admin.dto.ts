import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { UserRoles } from 'src/common/types/user.types';

export class CreateAdminDto {
  @ApiProperty({
    example: '60f1b5c3e13f4a001c4e2b1a',
    description: 'Foydalanuvchi IDsi',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    example: UserRoles.ADMIN,
    enum: UserRoles,
    description: 'Foydalanuvchi roli',
  })
  @IsNotEmpty()
  @IsEnum(UserRoles)
  role: UserRoles;
}
