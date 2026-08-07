import { PartialType } from '@nestjs/swagger';
import { CreateHomeworkSubmissionDto } from './create-homework_submission.dto';

export class UpdateHomeworkSubmissionDto extends PartialType(
  CreateHomeworkSubmissionDto,
) {}
