import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateAuthDto {
    @ApiProperty({example : "Fayzillo Ummatov"})
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @ApiProperty({example : "ummatovfayzilllo@gmail.com"})
    @IsEmail()
    email: string;

    @ApiProperty({example : "12345678"})
    @IsString()
    @IsNotEmpty()
    password: string;

}
export class VerifyDto{
    @ApiProperty({example : "ummatovfayzilllo@gmail.com"})
    @IsEmail()
    email: string;

    @ApiProperty({example : 123456})
    @Transform((e) =>{
        if(typeof e.value === 'number'){
            return e.value
        }else if(typeof e.value === 'string'){
            return e.value === '' ? undefined : +e.value
        }else{
            return undefined
        }
    })
    @IsNumber()
    code: number;
}