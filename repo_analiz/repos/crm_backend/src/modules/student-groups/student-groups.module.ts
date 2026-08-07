import { Module } from '@nestjs/common';
import { StudentGroupsService } from './student-groups.service';
import { StudentGroupsController } from './student-groups.controller';

@Module({
  controllers: [StudentGroupsController],
  providers: [StudentGroupsService],
})
export class StudentGroupsModule {}
