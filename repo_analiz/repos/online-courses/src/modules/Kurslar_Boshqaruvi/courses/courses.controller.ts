import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';

import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { filesInPut, FileWriter } from 'src/common/types/course.types';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}
  /**
   *
   * @param createCourseDto
   * @param files
   * @returns
   */
  @Post('create')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateCourseDto,
  })
  @UseInterceptors(FileFieldsInterceptor(filesInPut, { storage: FileWriter }))
  async create(
    @Body() createCourseDto: CreateCourseDto,
    @UploadedFiles()
    files: {
      banner?: Express.Multer.File[];
      introVideo?: Express.Multer.File[];
    },
  ) {
    const banner = files?.banner?.[0]?.filename;
    const introVideo = files?.introVideo?.[0]?.filename;
    return this.coursesService.create({
      ...createCourseDto,
      banner,
      introVideo,
    });
  }
  /**
   *
   * @returns
   */
  @Get('getAll')
  findAll() {
    return this.coursesService.findAll();
  }
  /**
   *
   * @param id
   * @returns
   */
  @Get('getOne/:id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  /**
   *
   * @param id
   * @param updateCourseDto
   * @param files
   * @returns
   */
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UpdateCourseDto,
  })
  @UseInterceptors(FileFieldsInterceptor(filesInPut, { storage: FileWriter }))
  @Patch('updateOne/:id')
  // Updated function
  update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    files: {
      banner?: Express.Multer.File[];
      introVideo?: Express.Multer.File[];
    },
  ) {
    console.log(files);
    return this.coursesService.update(id, updateCourseDto);
  }

  /**
   *
   * @param id
   * @returns
   */
  @Delete('deleteOne/:id')
  // Xullas o'chirish uchun bir narsa
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }
}
