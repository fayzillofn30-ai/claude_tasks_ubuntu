import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


export class CreateBuildTypeDto {
    @ApiProperty({example : "Ko'p qavatli"})
    @IsString()
    @IsNotEmpty()
    name : string
}
