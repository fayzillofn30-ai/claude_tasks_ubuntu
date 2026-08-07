import { Module } from '@nestjs/common';
import { LessonViewsService } from './lesson_views.service';
import { LessonViewsController } from './lesson_views.controller';

@Module({
  controllers: [LessonViewsController],
  providers: [LessonViewsService],
})
export class LessonViewsModule {}
