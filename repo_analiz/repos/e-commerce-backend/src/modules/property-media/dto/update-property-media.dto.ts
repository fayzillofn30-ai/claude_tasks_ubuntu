import { PartialType } from '@nestjs/swagger';
import { CreatePropertyMediaDto } from './create-property-media.dto';

export class UpdatePropertyMediaDto extends PartialType(CreatePropertyMediaDto) {}
