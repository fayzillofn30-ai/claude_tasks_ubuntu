import { Module } from '@nestjs/common';
import { PurcachedCoursesService } from './purcached_courses.service';
import { PurcachedCoursesController } from './purcached_courses.controller';

@Module({
  controllers: [PurcachedCoursesController],
  providers: [PurcachedCoursesService],
})
export class PurcachedCoursesModule {}
