import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { GroupesService } from './groupes.service';
import { CreateGroupeDto } from './dto/create-groupe.dto';
import { UpdateGroupeDto } from './dto/update-groupe.dto';

@Controller('groupes')
export class GroupesController {
  constructor(private readonly groupesService: GroupesService) {}

  @Post("create")
  create(@Body() createGroupeDto: CreateGroupeDto) {
    return this.groupesService.create(createGroupeDto);
  }

  @Get("get-all")
  findAll() {
    return this.groupesService.findAll();
  }

  @Get('get-one/:id')
  findOne(@Param('id') id: string) {
    return this.groupesService.findOne(id);
  }

  @Get("get-all/by-roomid/:id")
  getAllByRoomId(@Param("id") id : string){
    return this.groupesService.getAllByRoomId(id)
  }

  @Get("get-one/by-courseid/:id")
  getOne_ByourseId(@Param("id") id : string){
    return this.groupesService.findOneByCourseId(id)
  }

  @Patch('update-one/:id')
  update(@Param('id') id: string, @Body() updateGroupeDto: UpdateGroupeDto) {
    return this.groupesService.update(id, updateGroupeDto);
  }

  @Delete('delete-one/:id')
  remove(@Param('id') id: string) {
    return this.groupesService.remove(id);
  }
}
