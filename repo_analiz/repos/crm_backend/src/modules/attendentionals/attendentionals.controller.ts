import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AttendentionalsService } from './attendentionals.service';
import { CreateAttendentionalDto } from './dto/create-attendentional.dto';
import { UpdateAttendentionalDto } from './dto/update-attendentional.dto';

@Controller('attendentionals')
export class AttendentionalsController {
  constructor(private readonly attendentionalsService: AttendentionalsService) {}

  @Post("create")
  create(@Body() data: CreateAttendentionalDto) {
    return this.attendentionalsService.create(data);
  }

  @Get("get-all")
  findAll() {
    return this.attendentionalsService.findAll();
  }

  @Get("get-all/by-lessonid/:id")
  getAll_By_LessonId(@Param("id") id : string){
    return this.attendentionalsService.getAll_ByLessonId(id)
  }

  @Get("get-all/by-groupid/:id")
  getAll_by_GroupId(@Param("id") id : string){
    return this.attendentionalsService.getAll_ByGroupId(id)
  }

  @Get('get-one/:id')
  findOne(@Param('id') id: string) {
    return this.attendentionalsService.findOne(id);
  }

  @Patch('update-one/:id')
  update(@Param('id') id: string, @Body() data: UpdateAttendentionalDto) {
    return this.attendentionalsService.update(id, data);
  }

  @Delete('delete-one/:id')
  remove(@Param('id') id: string) {
    return this.attendentionalsService.remove(id);
  }
}
