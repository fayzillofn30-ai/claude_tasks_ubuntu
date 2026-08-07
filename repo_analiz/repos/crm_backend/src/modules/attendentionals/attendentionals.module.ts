import { Module } from '@nestjs/common';
import { AttendentionalsService } from './attendentionals.service';
import { AttendentionalsController } from './attendentionals.controller';

@Module({
  controllers: [AttendentionalsController],
  providers: [AttendentionalsService],
})
export class AttendentionalsModule {}
