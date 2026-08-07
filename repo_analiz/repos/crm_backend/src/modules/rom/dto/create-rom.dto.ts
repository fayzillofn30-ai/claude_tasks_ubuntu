import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsPositive, IsString, Min } from "class-validator";

export class CreateRomDto {
  @ApiProperty({ example: "Room A-101" })
  @IsString()
  name: string;

  @ApiProperty({ example: 101 })
  @IsInt()
  @Min(1)
  romNumber: number;

  @ApiProperty({ example: 30 })
  @IsInt()
  @IsPositive()
  pleaces: number;

  @ApiProperty({ example: true, default: true })
  @IsBoolean()
  isOpen: boolean = true;
}
