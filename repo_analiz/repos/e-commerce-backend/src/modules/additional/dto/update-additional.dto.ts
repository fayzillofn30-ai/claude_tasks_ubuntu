import { PartialType } from '@nestjs/swagger';
import { CreateAdditionalDto } from './create-additional.dto';

export class UpdateAdditionalDto extends PartialType(CreateAdditionalDto) {}
