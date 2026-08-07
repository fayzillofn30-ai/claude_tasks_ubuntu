import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PurcachedCoursesService } from './purcached_courses.service';
import { CreatePurcachedCourseDto } from './dto/create-purcached_course.dto';
import { UpdatePurcachedCourseDto } from './dto/update-purcached_course.dto';

@Controller('purcached-courses')
export class PurcachedCoursesController {
  constructor(
    private readonly purcachedCoursesService: PurcachedCoursesService,
  ) {}

  @Post()
  create(@Body() createPurcachedCourseDto: CreatePurcachedCourseDto) {
    return this.purcachedCoursesService.create(createPurcachedCourseDto);
  }

  @Get()
  findAll() {
    return this.purcachedCoursesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purcachedCoursesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePurcachedCourseDto: UpdatePurcachedCourseDto,
  ) {
    return this.purcachedCoursesService.update(+id, updatePurcachedCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purcachedCoursesService.remove(+id);
  }
}
