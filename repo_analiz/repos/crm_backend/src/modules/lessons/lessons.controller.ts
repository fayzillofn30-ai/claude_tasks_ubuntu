import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post("create")
  create(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonsService.create(createLessonDto);
  }

  @Get("get-all")
  findAll() {
    return this.lessonsService.findAll();
  }

  @Get('get-one/by-lessonid/:id')
  findOneBy_LessonId(@Param('id') id: string) {
    return this.lessonsService.findOneByLessonId(id);
  }

  @Get("get-all/by-groupid/:id")
  getAll_ByGroupId(@Param("id") groupId : string){
    return this.lessonsService.getAll_Lesson_byGroupId(groupId)
  }

  @Patch('update-one/by-lessonid/:id')
  update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonsService.update(id, updateLessonDto);
  }

  @Delete('delete-one/by-lessonid/:id')
  remove(@Param('id') id: string) {
    return this.lessonsService.remove(id);
  }
}
