import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { checAlreadykExistsResurs, checkExistsResurs } from 'src/common/types/check.functions.types';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';
import { Public } from 'src/global/decorators/auth.decorators';
import { ConfigService } from '@nestjs/config';
import { urlGenerator } from 'src/common/types/generator.types';
import { Category } from '@prisma/client';
import { unlinkFile } from 'src/common/types/file.cotroller.typpes';

@Public()
@Injectable()
export class CategoriesService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService
  ) { }

  async create(data: CreateCategoryDto, image?: string) {
    image = image ? urlGenerator(this.config, image) : ""
    await checAlreadykExistsResurs(this.prisma, ModelsEnumInPrisma.Category, "name", data.name)
    const newCategory = await this.prisma.category.create({ data: { ...data, img: image } })

    return {
      message: 'This action adds a new category', category: newCategory
    };
  }

  async findAll() {
    return {
      message: `This action returns all categories`,
      categories: await this.prisma.category.findMany()
    };
  }

  async findOne(id: number) {
    return {
      message: `This action returns a #${id} category`,
      category: await checkExistsResurs<Category>(this.prisma, ModelsEnumInPrisma.Category, "id", id)
    };
  }

  async update(id: number, data: UpdateCategoryDto, image?: string) {
    await checAlreadykExistsResurs(this.prisma, ModelsEnumInPrisma.Category, "name", data.name)
    const oldCategory = await checkExistsResurs<Category>(this.prisma, ModelsEnumInPrisma.Category, "id", id)
    const result: Partial<Category> = {}

    if (image) {
      result['img'] = urlGenerator(this.config, image)
      try {
        const fileName = oldCategory.img.split("/").at(-1)
        unlinkFile(fileName || "")
      } catch (error) {
        console.log("Category service remove function ", error)
      }
    }
    result['name'] = data.name
    
    return {
      message: `This action updates a #${id} category`,
      category: await this.prisma.category.update({ where: { id: id }, data: { ...result } })
    };
  }

  async remove(id: number) {
    const oldCategory = await checkExistsResurs<Category>(this.prisma, ModelsEnumInPrisma.Category, "id", id)

    try {
      const fileName = oldCategory.img.split("/").at(-1)
      unlinkFile(fileName || "")
    } catch (error) {
      console.log("Category service remove function ", error)
    }

    return {
      message: `This action removes a #${id} category`,
      category: await this.prisma.category.delete({ where: { id: id } })
    };
  }
}
