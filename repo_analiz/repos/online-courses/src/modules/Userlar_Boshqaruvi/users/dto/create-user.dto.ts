import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Validate } from 'class-validator';
import { IsPhoneNumberConstraint } from 'src/common/utils/user.validation';

export class CreateUserDto {
  @ApiProperty({ example: '99891102141' })
  @IsNotEmpty()
  @IsString()
  @Validate(IsPhoneNumberConstraint)
  @Length(11, 11, {
    message: "Raqam uzunligi 11 ta bo'lishi kerak !",
  })
  phoneNumber: string;

  @ApiProperty({ example: 'strongpassword' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ example: 'Jhon Doe' })
  @IsNotEmpty()
  @IsString()
  fullName: string;
}
