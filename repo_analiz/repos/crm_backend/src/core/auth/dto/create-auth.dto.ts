import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsDateString,
  MinLength,
} from "class-validator";

enum RoleStafs {
  ADMIN = "ADMIN",
  TEACHER = "TEACHER",
  ASISTANT = "ASISTANT",
  STUDENT = "STUDENT",
}

export class AuthRegisterDto {
  @ApiProperty({ example: "STUDENT", enum: RoleStafs, default: RoleStafs.STUDENT })
  @IsEnum(RoleStafs)
  role: RoleStafs = RoleStafs.STUDENT;

  @ApiProperty({ example: "Ali" })
  @IsString()
  firstName: string;

  @ApiProperty({ example: "Valiyev" })
  @IsString()
  lastName: string;

  @ApiProperty({ example: "Karim o'g'li", required: false })
  @IsOptional()
  @IsString()
  father?: string;

  @ApiProperty({ example: "ali@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "2000-05-20T00:00:00.000Z" })
  @IsDateString()
  birthDay: Date;

  @ApiProperty({ example: "https://example.com/image.jpg" })
  @IsString()
  image: string;

  @ApiProperty({ example: "+998901234567", required: false })
  @IsOptional()
  @IsPhoneNumber("UZ")
  phone?: string;

  @ApiProperty({ example: "StrongP@ssw0rd" })
  @IsString()
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  password: string;
}
