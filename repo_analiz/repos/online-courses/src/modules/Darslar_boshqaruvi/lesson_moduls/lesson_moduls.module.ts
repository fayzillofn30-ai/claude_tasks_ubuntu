import { Module } from '@nestjs/common';
import { LessonModulsService } from './lesson_moduls.service';
import { LessonModulsController } from './lesson_moduls.controller';

@Module({
  controllers: [LessonModulsController],
  providers: [LessonModulsService],
})
export class LessonModulsModule {}
