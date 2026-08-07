import { Module } from '@nestjs/common';
import { AdditionalService } from './additional.service';
import { AdditionalController } from './additional.controller';

@Module({
  controllers: [AdditionalController],
  providers: [AdditionalService],
})
export class AdditionalModule {}
