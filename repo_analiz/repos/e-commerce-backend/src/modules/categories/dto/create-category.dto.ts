import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {
    @Transform((e) => {
        console.log("Transformer in Category dto ", e)
        return e.value
    })
    @IsString()
    @IsNotEmpty()
    name : string
}
