import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateCourseDto) {
    await this.checkCreateExists(data)
    const { name, about, price, level, categoryId, mentorId, published } = data;

    data.banner = `http://localhost:15975/uploads/${data.banner}`;
    data.introVideo = `http://localhost:15975/uploads/${data.introVideo}`;

    return await this.prisma.course.create({
      data: { ...data },
    });
  }
  async checkCreateExists(data : CreateCourseDto){
    const oldCourse = await this.prisma.course.findFirst({
      where : {
        AND : [
          {name : data.name},
          {level : data.level}
        ]
      }
    });
    if(oldCourse){
      throw new BadRequestException(`${data.name} already exists level in : [${data.level}]`)
    }
    if(!(await this.prisma.courseCategory.findFirst({where : {id : data.categoryId}}))){
      throw new NotFoundException(`Category not found by Id : [${data.categoryId}]`)
    }
    if(!(await this.prisma.mentorProfile.findFirst({where : {id : data.mentorId}}))){
      throw new NotFoundException(`Mentor not found by Id [${data.mentorId}]`)
    }
  }
  async findAll() {
    return await this.prisma.course.findMany();
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        category: true,
        mentor: true,
      },
    });

    if (!course) {
      throw new NotFoundException(`Kurs topilmadi (id: ${id})`);
    }

    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) {
      throw new NotFoundException(`Kurs topilmadi (id: ${id})`);
    }
    const banner: string | undefined = updateCourseDto.banner;
    const introVideo: string | undefined = updateCourseDto.introVideo;
    if (Object.values(updateCourseDto).length === 0) {
      throw new BadRequestException('Invalid data emtiy body');
    }
    console.log(banner, updateCourseDto);
    return await this.prisma.course.update({
      where: { id },
      data: {
        ...updateCourseDto,
        banner: banner ?? course.banner,
        introVideo: introVideo ?? course.introVideo,
      },
    });
  }

  async remove(id: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) {
      throw new NotFoundException(`Kurs topilmadi (id: ${id})`);
    }

    return await this.prisma.course.delete({
      where: { id },
    });
  }
}
