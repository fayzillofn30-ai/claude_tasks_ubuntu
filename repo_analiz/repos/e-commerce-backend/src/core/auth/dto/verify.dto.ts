import { ApiProperty } from "@nestjs/swagger";

export class EditPasswordDto {
  @ApiProperty()
  password : string;

  @ApiProperty()
  new_password: string;
}

export class VerifyResetDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  newPassword: string;
}