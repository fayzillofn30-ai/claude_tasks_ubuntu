import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString, IsUUID } from "class-validator";
import { RoleArr, RoleStafs } from "src/modules/users/dto/create-user.dto";
export class CreateRoleDto {
    @ApiProperty({ examples: RoleArr })
    @IsEnum(RoleArr)
    role: RoleStafs

    @ApiProperty({ example: "dew-defcsceds-cedwscwe-cedscd" })
    @IsUUID()
    staffId: string
}