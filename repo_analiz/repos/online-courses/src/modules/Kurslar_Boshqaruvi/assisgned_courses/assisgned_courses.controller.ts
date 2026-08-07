import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AssisgnedCoursesService } from './assisgned_courses.service';
import { CreateAssisgnedCourseDto } from './dto/create-assisgned_course.dto';

@Controller('assisgned-courses')
export class AssisgnedCoursesController {
  constructor(
    private readonly assisgnedCoursesService: AssisgnedCoursesService,
  ) {}

  @Post("createone")
  create(@Body() createAssisgnedCourseDto: CreateAssisgnedCourseDto) {
    return this.assisgnedCoursesService.create(createAssisgnedCourseDto);
  }

  @Get("getall")
  findAll() {
    return this.assisgnedCoursesService.findAll();
  }

  @Get('getone/:id')
  findOne(@Param('id') id: string) {
    return this.assisgnedCoursesService.findOne(id);
  }

  @Delete('deleteone/:id')
  remove(@Param('id') id: string) {
    return this.assisgnedCoursesService.remove(id);
  }
}
