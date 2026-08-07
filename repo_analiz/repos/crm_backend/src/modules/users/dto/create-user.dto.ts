import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsDateString, IsEmail, IsEnum, IsObject, IsOptional, IsString, MinLength } from "class-validator"

export enum RoleStafs {
  ADMIN = "ADMIN",
  TEACHER = "TEACHER",
  ASISTANT = "ASISTANT",
  STUDENT = "STUDENT"
}
export const RoleArr = ["ADMIN", "TEACHER", "ASISTANT", "STUDENT"]


export class CreateUserDto {
  @ApiProperty({ example: "example@gmail.com", description: "User email manzili" })
  @IsEmail({}, { message: "Email noto‘g‘ri formatda kiritilgan" })
  email: string;

  @ApiProperty({ example: "12345678", description: "Foydalanuvchi paroli (kamida 6 belgili)" })
  @IsString()
  @MinLength(6, { message: "Parol kamida 6 belgidan iborat bo‘lishi kerak" })
  password: string;

  @ApiProperty({ example: "Fayzillo", description: "Foydalanuvchining ismi" })
  @IsString()
  firstName: string;

  @ApiProperty({ example: "Ummatov", description: "Foydalanuvchining familiyasi" })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ example: "Rustamovich", description: "Otasi ismi" })
  @IsOptional()
  @IsString()
  father?: string;

  @ApiPropertyOptional({ example: "+998901234567", description: "Telefon raqami" })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    type: "string",
    format: "binary",
    description: "Foydalanuvchining rasmi (fayl sifatida yuboriladi)",
  })
  @IsOptional()
  @IsObject()
  image?: any;

  @ApiProperty({
    example: "2025-10-20T08:00:00Z",
    description: "Tug‘ilgan sana (ISO formatda)"
  })
  @IsDateString({}, { message: "birthDay ISO formatda bo‘lishi kerak" })
  @Transform(({ value }) => new Date(value).toISOString())
  birthDay: string;
}

