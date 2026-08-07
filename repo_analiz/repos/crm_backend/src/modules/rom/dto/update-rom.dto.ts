import { PartialType } from '@nestjs/swagger';
import { CreateRomDto } from './create-rom.dto';

export class UpdateRomDto extends PartialType(CreateRomDto) {}
