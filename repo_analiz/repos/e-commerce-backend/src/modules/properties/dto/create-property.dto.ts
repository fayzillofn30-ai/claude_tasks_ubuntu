import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserData } from 'src/global/decorators/auth.decorators';
import { JwtPayload } from 'jsonwebtoken';

export enum SaleType {
  RENT = 'RENT',
  SALE = 'SALE',
}

export class CreatePropertyDto {
  @ApiProperty({
    description: 'Property title',
    example: 'Beautiful 3-bedroom apartment',
    required: true
  })
  @Transform(e => {
    console.log("TransFormer in property create dto ",e)
    return e.value
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Property description',
    example: 'Spacious apartment with modern amenities',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Property price',
    example: 500000,
    type: 'integer'
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  price: number;

  @ApiProperty({
    description: 'Discount amount',
    example: 25.5,
    required: false,
    type: 'number'
  })
  @Transform(({ value }) => parseFloat(value))
  @IsOptional()
  @IsNumber()
  discount?: number;

  @ApiProperty({
    description: 'Property location URL',
    example: 'https://maps.app.goo.gl/nhEkVzyhhrwTa5Lk8',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  locationUrl: string;

  @ApiProperty({
    description: 'Property address',
    example: 'Andijon,Andijon Viloyati, Oʻzbekiston',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Sale type',
    enum: SaleType,
    example: SaleType.SALE,
    required: false
  })
  @IsEnum(SaleType)
  @IsOptional()
  status?: SaleType;

  @ApiProperty({
    description: 'Is property for sale',
    example: true,
    required: false,
    type: 'boolean'
  })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @IsOptional()
  isSale?: boolean;

  @ApiProperty({
    description: 'Category ID',
    example: 6,
    type: 'integer'
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  categoryId: number;
}