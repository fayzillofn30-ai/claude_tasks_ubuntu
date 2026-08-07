import { PartialType } from '@nestjs/swagger';
import { CreateLessonModulDto } from './create-lesson_modul.dto';

export class UpdateLessonModulDto extends PartialType(CreateLessonModulDto) {}
