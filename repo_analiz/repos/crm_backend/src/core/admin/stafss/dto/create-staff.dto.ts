import { ApiProperty } from "@nestjs/swagger";
import { RoleStafs } from "@prisma/client";
import { IsEnum, IsUUID } from "class-validator";
import { RoleArr } from "src/modules/users/dto/create-user.dto";

export class CreateStaffDto{
    @ApiProperty({example : ""})
    @IsUUID()
    userId : string

    @ApiProperty({examples : RoleArr})
    @IsEnum(RoleArr)
    role : RoleStafs
}