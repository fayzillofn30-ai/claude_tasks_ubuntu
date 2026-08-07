import { PartialType } from '@nestjs/swagger';
import { CreateLastActivitiyDto } from './create-last_activitiy.dto';

export class UpdateLastActivitiyDto extends PartialType(
  CreateLastActivitiyDto,
) {}
