import { ApiProperty } from "@nestjs/swagger"
import { IsUUID } from "class-validator"

export class CreateFavoriteDto {
    
    @ApiProperty({example : "dcewcew-cewdcew-cedwcwc-cewcc"})
    @IsUUID()
    propertyId : string
}
