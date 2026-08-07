import { PartialType } from '@nestjs/swagger';
import { CreateLessonViewDto } from './create-lesson_view.dto';

export class UpdateLessonViewDto extends PartialType(CreateLessonViewDto) {}
