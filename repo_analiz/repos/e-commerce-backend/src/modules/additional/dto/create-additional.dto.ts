import { IsUUID, IsString, IsInt, IsNumber, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdditionalDto {
  @ApiProperty({example : "49e4fb41-109e-4f93-ad84-7f8af260d21d"})
  @IsUUID()
  @IsNotEmpty()
  propertyId: string;

  @ApiProperty({example : "53802dde-969e-439e-ae6c-c0605288abf6"})
  @IsUUID()
  @IsNotEmpty()
  buildTypeId: string;

  @ApiProperty({example : 'Modern House'})
  @IsString()
  @IsNotEmpty()
  label: string;
  
  @ApiProperty({example : 'Modern House'})
  @IsString()
  @IsNotEmpty()
  material: string;

  @ApiProperty({example : 5})
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  rooms: number;
  
  @ApiProperty({example : 5})
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  beds: number;
  
  @ApiProperty({example : 5})
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  baths: number;

  @ApiProperty({example : 5})
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  garages: number;

  @ApiProperty({example : 5})
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  garageSize: number;

  @ApiProperty({example : 5})
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  year_build: number;

  @ApiProperty({example : 5})
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  homeArea: number;

  @ApiProperty({example : "120x100"})
  @IsString()
  @IsNotEmpty()
  lotDimensions: string;

  @ApiProperty({example : 1200})
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  lotArea: number;

}
