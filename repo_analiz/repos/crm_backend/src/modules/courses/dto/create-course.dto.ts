import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsArray, IsBoolean, IsNumber, IsString } from "class-validator"

export class CreateCourseDto {

    @ApiProperty({ example: "Kurs nomi" })
    @IsString()
    name: string

    @ApiProperty({ example: true })
    @Transform(({ value }) => {
        if (typeof value === "boolean") return value
        if (typeof value === "string") {
            const normalized = value.trim().toLowerCase()
            if (["false", "0", "no"].includes(normalized)) return false
            if (["true", "1", "yes"].includes(normalized)) return true
        }
        return false
    })
    @IsBoolean()
    published: boolean

    @ApiProperty({ example: 150000 })
    @Transform(({ value }) => {
        const num = Number(value)
        return Number.isFinite(num) && !Number.isNaN(num) ? num : undefined
    })
    @IsNumber({}, { message: "price raqam bo‘lishi kerak" })
    price: number

    @ApiProperty({ example: 3 })
    @Transform(({ value }) => {
        const num = Number(value)
        return Number.isFinite(num) && !Number.isNaN(num) ? num : undefined
    })
    @IsNumber({}, { message: "durationMont raqam bo‘lishi kerak" })
    durationMont: number

    @ApiProperty({ example: [1, 3, 5] })
    @Transform(({ value }) => {
        if (Array.isArray(value)) {
            let res=value.map((v) => typeof v == "string" ? Number(v) : v).filter((n) => !isNaN(n))
            return value
        }
        if (typeof value === "string") {
            return Array.from(value)
                .map((v) => Number(v.trim()))
                .filter((n) => !Number.isNaN(n))
        }
        return []
    })
    @IsArray({ message: "weekDays massiv bo‘lishi kerak" })
    weekDays: number[]

    @ApiProperty({ example: 60 })
    @Transform(({ value }) => {
        const num = Number(value)
        return Number.isFinite(num) && !Number.isNaN(num) ? num : undefined
    })
    @IsNumber({}, { message: "durationMinut raqam bo‘lishi kerak" })
    durationMinut: number
}
