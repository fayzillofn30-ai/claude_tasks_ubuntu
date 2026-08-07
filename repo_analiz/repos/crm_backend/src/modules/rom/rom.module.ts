import { Module } from '@nestjs/common';
import { RomService } from './rom.service';
import { RomController } from './rom.controller';

@Module({
  controllers: [RomController],
  providers: [RomService],
})
export class RomModule {}
