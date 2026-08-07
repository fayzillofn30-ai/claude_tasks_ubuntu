import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class LoginDto {

        @ApiProperty({example : "ummatovfayzilllo@gmail.com"})
        @IsEmail()
        email: string;
    
        @ApiProperty({example : "12345678"})
        @IsString()
        @IsNotEmpty()
        password: string;
}
