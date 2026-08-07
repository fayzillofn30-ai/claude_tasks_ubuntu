import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LessonFilesService } from './lesson_files.service';
import { CreateLessonFileDto } from './dto/create-lesson_file.dto';
import { UpdateLessonFileDto } from './dto/update-lesson_file.dto';

@Controller('lesson-files')
export class LessonFilesController {
  constructor(private readonly lessonFilesService: LessonFilesService) {}

  @Post()
  create(@Body() createLessonFileDto: CreateLessonFileDto) {
    return this.lessonFilesService.create(createLessonFileDto);
  }

  @Get()
  findAll() {
    return this.lessonFilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonFilesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLessonFileDto: UpdateLessonFileDto,
  ) {
    return this.lessonFilesService.update(+id, updateLessonFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonFilesService.remove(+id);
  }
}
