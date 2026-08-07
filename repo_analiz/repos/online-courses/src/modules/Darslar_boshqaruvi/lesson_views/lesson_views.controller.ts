import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LessonViewsService } from './lesson_views.service';
import { CreateLessonViewDto } from './dto/create-lesson_view.dto';
import { UpdateLessonViewDto } from './dto/update-lesson_view.dto';

@Controller('lesson-views')
export class LessonViewsController {
  constructor(private readonly lessonViewsService: LessonViewsService) {}

  @Post()
  create(@Body() createLessonViewDto: CreateLessonViewDto) {
    return this.lessonViewsService.create(createLessonViewDto);
  }

  @Get()
  findAll() {
    return this.lessonViewsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonViewsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLessonViewDto: UpdateLessonViewDto,
  ) {
    return this.lessonViewsService.update(+id, updateLessonViewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonViewsService.remove(+id);
  }
}
