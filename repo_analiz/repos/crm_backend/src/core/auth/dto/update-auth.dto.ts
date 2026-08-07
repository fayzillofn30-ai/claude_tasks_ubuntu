import { PartialType } from '@nestjs/swagger';
import { AuthRegisterDto } from './create-auth.dto';

export class UpdateAuthDto extends PartialType(AuthRegisterDto) {}
