import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BuildTypeService } from './build-type.service';
import { CreateBuildTypeDto } from './dto/create-build-type.dto';
import { UpdateBuildTypeDto } from './dto/update-build-type.dto';

@Controller('build-type')
export class BuildTypeController {
  constructor(private readonly buildTypeService: BuildTypeService) {}

  @Post("create-one")
  create(@Body() data: CreateBuildTypeDto) {
    return this.buildTypeService.create(data);
  }

  @Get("get-all")
  findAll() {
    return this.buildTypeService.findAll();
  }

  @Get('get-one/:id')
  findOne(@Param('id') id: string) {
    return this.buildTypeService.findOne(id);
  }

  @Patch('update-one/:id')
  update(@Param('id') id: string, @Body() data: UpdateBuildTypeDto) {
    return this.buildTypeService.update(id, data);
  }

  @Delete('delete-one/:id')
  remove(@Param('id') id: string) {
    return this.buildTypeService.remove(id);
  }
}
