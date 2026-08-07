import { PartialType } from '@nestjs/swagger';
import { CreateBuildTypeDto } from './create-build-type.dto';

export class UpdateBuildTypeDto extends PartialType(CreateBuildTypeDto) {}
