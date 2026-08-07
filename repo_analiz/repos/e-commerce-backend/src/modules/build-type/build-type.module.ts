import { Module } from '@nestjs/common';
import { BuildTypeService } from './build-type.service';
import { BuildTypeController } from './build-type.controller';

@Module({
  controllers: [BuildTypeController],
  providers: [BuildTypeService],
})
export class BuildTypeModule {}
