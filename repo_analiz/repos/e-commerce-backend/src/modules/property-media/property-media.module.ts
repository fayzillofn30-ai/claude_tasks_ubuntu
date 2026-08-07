import { Module } from '@nestjs/common';
import { PropertyMediaService } from './property-media.service';
import { PropertyMediaController } from './property-media.controller';

@Module({
  controllers: [PropertyMediaController],
  providers: [PropertyMediaService],
})
export class PropertyMediaModule {}
