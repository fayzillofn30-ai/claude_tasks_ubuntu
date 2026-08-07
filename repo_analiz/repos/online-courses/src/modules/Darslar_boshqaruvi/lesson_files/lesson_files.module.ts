import { Module } from '@nestjs/common';
import { LessonFilesService } from './lesson_files.service';
import { LessonFilesController } from './lesson_files.controller';

@Module({
  controllers: [LessonFilesController],
  providers: [LessonFilesService],
})
export class LessonFilesModule {}
