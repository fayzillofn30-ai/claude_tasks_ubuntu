import { Module } from '@nestjs/common';
import { LastActivitiyService } from './last_activitiy.service';
import { LastActivitiyController } from './last_activitiy.controller';

@Module({
  controllers: [LastActivitiyController],
  providers: [LastActivitiyService],
})
export class LastActivitiyModule {}
