import { Module } from '@nestjs/common';
import { AssisgnedCoursesService } from './assisgned_courses.service';
import { AssisgnedCoursesController } from './assisgned_courses.controller';

@Module({
  controllers: [AssisgnedCoursesController],
  providers: [AssisgnedCoursesService],
})
export class AssisgnedCoursesModule {}
