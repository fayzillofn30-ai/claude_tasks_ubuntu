import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorages } from 'src/common/types/upload_types';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) { }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: "string", example: "Backend" },
        price: { type: "number", example: 150000 },
        durationMont: { type: "number", example: 4},
        weekDays: { type: "number", example: [1, 3, 5] },
        durationMinut: { type: "number", example: 90},
        published : {type : "boolean" ,example : false},
        image: {
          type: "string",
          format: "binary"
        }
      },
      required: ["name", "price", "durationMont", "weekDays", "durationMinut", "image"]
    },
  })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("image", fileStorages(["image"])))
  @Post("create")
  create(
    @Body() dto: CreateCourseDto,
    @UploadedFile() image? : Express.Multer.File
  ) {
    return this.coursesService.create(dto,image);
  }

  @Get("get-all")
  findAll() {
    return this.coursesService.findAll();
  }

  @Get('get-one/:id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: "string", example: "Backend" },
        price: { type: "number", example: 150000 },
        durationMont: { type: "number", example: 4},
        weekDays: { type: "number", example: [1, 3, 5] },
        durationMinut: { type: "number", example: 90},
        published : {type : "boolean" ,example : false},
        image: {
          type: "string",
          format: "binary"
        }
      },
    },
  })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("image", fileStorages(["image"])))
  @Patch('update-one/:id')
  update(@Param('id') id: string, @Body() dto: UpdateCourseDto,@UploadedFile() image? : Express.Multer.File) {
    return this.coursesService.update(id, dto,image);
  }

  @Delete('delete-one/:id')
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }
}
