import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { urlGenerator } from 'src/common/types/generator.types';
import { unlinkFile } from 'src/common/types/file.cotroller.typpes';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';
import { checAlreadykExistsResurs, checkExistsResurs } from 'src/common/types/check.functions.types';
import { Course } from '@prisma/client';

@Injectable()
export class CoursesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async create(data: CreateCourseDto, image?: Express.Multer.File) {
    const old = await this.prisma.course.findFirst({
      where : {name : data.name}
    })
    if(old && !old.isDeleted){
      throw new ConflictException(`Course name already exists [${data.name}]`)
    }
    if (image) data['image'] = urlGenerator(this.config, image.filename);
    const course = await this.prisma.course.create({ data: { ...data, isDeleted: false } });
    return { message: 'Course created', course };
  }

  async findAll() {
    const courses = await this.prisma.course.findMany({ where: { isDeleted: false } });
    return { message: 'All courses', count: courses.length, courses };
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findFirst({ where: { id, isDeleted: false } });
    if (!course) throw new NotFoundException(`Course not found [${id}]`);
    return { message: 'Course found', course };
  }

  async update(id: string, data: UpdateCourseDto, image?: Express.Multer.File) {
    const course = await this.prisma.course.findFirst({ where: { id, isDeleted: false } });
    if (!course) throw new NotFoundException(`Course not found or deleted [${id}]`);

    if (data.name) {
      const duplicate = await this.prisma.course.findFirst({ where: { name: data.name, isDeleted: false } });
      if (duplicate && duplicate.id !== id)
        throw new BadRequestException(`Already exist course by name [${data.name}]`);
    }

    if (image) {
      data['image'] = urlGenerator(this.config, image.filename);
      if (course.image) {
        const file = course.image.split('/').at(-1);
        if (file) unlinkFile(file);
      }
    }

    const updated = await this.prisma.course.update({ where: { id }, data });
    console.log(updated)
    return { message: 'Course updated', course: updated };
  }

  async remove(id: string) {
    const course = await checkExistsResurs<Course>(this.prisma, ModelsEnumInPrisma.COURSES, 'id', id);
    if (course.isDeleted) throw new BadRequestException(`Course already deleted [${id}]`);

    await this.prisma.course.update({ where: { id }, data: { isDeleted: true } });
    return { message: 'Course soft-deleted', courseId: id };
  }

  async restore(id: string) {
    const course = await this.prisma.course.findFirst({ where: { id, isDeleted: true } });
    if (!course) throw new NotFoundException(`Deleted course not found [${id}]`);
    const restored = await this.prisma.course.update({ where: { id }, data: { isDeleted: false } });
    return { message: 'Course restored', course: restored };
  }
}
