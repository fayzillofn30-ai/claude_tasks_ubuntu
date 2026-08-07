import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const exists = await this.prisma.courseCategory.findFirst({
      where: { name: createCategoryDto.name },
    });

    if (exists) {
      throw new BadRequestException(
        `Kategoriya nomi allaqachon mavjud: ${createCategoryDto.name}`,
      );
    }

    return this.prisma.courseCategory.create({
      data: createCategoryDto,
    });
  }

  async findAll() {
    return this.prisma.courseCategory.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.courseCategory.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Kategoriya topilmadi (id: ${id})`);
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const exists = await this.prisma.courseCategory.findFirst({
        where: { name: updateCategoryDto.name },
      });

      if (exists) {
        throw new BadRequestException(
          `Bunday nomdagi kategoriya allaqachon mavjud: ${updateCategoryDto.name}`,
        );
      }
    }

    return this.prisma.courseCategory.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // mavjudligini tekshiramiz

    return this.prisma.courseCategory.delete({
      where: { id },
    });
  }
}
