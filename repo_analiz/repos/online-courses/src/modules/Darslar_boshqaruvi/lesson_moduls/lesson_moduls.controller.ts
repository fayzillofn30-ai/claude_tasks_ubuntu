import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LessonModulsService } from './lesson_moduls.service';
import { CreateLessonModulDto } from './dto/create-lesson_modul.dto';
import { UpdateLessonModulDto } from './dto/update-lesson_modul.dto';

@Controller('lesson-moduls')
export class LessonModulsController {
  constructor(private readonly lessonModulsService: LessonModulsService) {}

  @Post()
  create(@Body() createLessonModulDto: CreateLessonModulDto) {
    return this.lessonModulsService.create(createLessonModulDto);
  }

  @Get()
  findAll() {
    return this.lessonModulsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonModulsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLessonModulDto: UpdateLessonModulDto,
  ) {
    return this.lessonModulsService.update(+id, updateLessonModulDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonModulsService.remove(+id);
  }
}
