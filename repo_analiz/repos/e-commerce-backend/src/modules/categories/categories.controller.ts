import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { categoryApiBody } from 'src/common/types/api.body.types';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorages } from 'src/common/types/upload_types';
import { Public } from 'src/global/decorators/auth.decorators';

@Public()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post("create")
  @ApiConsumes('multipart/form-data') // ✅ to‘g‘ri yozilgan
  @ApiBody(categoryApiBody)
  @UseInterceptors(FileInterceptor('image', fileStorages(["image"])))

  create(
    @Body() data: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File, // ✅ FILE QABUL QILISH
  ) {
    return this.categoriesService.create(data, file.filename); // ✅ file'ni ham servise'ga yuborish
  }

  @Get("get-all")
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get('get-one/:id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @ApiConsumes('multipart/form-data') // ✅ to‘g‘ri yozilgan
  @ApiBody(categoryApiBody)
  @UseInterceptors(FileInterceptor('image', fileStorages(["image"])))
  @Patch('update-one/:id')
  update(
    @Param('id') id: string, 
    @Body() data: UpdateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if(file){
      return this.categoriesService.update(+id, data,file.filename);
    }else{
      return this.categoriesService.update(+id, data);
    }
  }

  @Delete('delete-one/:id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
