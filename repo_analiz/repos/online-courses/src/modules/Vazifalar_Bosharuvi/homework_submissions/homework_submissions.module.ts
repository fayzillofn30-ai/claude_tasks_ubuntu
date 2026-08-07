import { Module } from '@nestjs/common';
import { HomeworkSubmissionsService } from './homework_submissions.service';
import { HomeworkSubmissionsController } from './homework_submissions.controller';

@Module({
  controllers: [HomeworkSubmissionsController],
  providers: [HomeworkSubmissionsService],
})
export class HomeworkSubmissionsModule {}
