import { PartialType } from '@nestjs/swagger';
import { CreatePurcachedCourseDto } from './create-purcached_course.dto';

export class UpdatePurcachedCourseDto extends PartialType(
  CreatePurcachedCourseDto,
) {}
