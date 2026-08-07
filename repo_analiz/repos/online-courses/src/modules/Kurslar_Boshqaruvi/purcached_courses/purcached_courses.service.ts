import { Injectable } from '@nestjs/common';
import { CreatePurcachedCourseDto } from './dto/create-purcached_course.dto';
import { UpdatePurcachedCourseDto } from './dto/update-purcached_course.dto';

@Injectable()
export class PurcachedCoursesService {
  create(createPurcachedCourseDto: CreatePurcachedCourseDto) {
    return 'This action adds a new purcachedCourse';
  }

  findAll() {
    return `This action returns all purcachedCourses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} purcachedCourse`;
  }

  update(id: number, updatePurcachedCourseDto: UpdatePurcachedCourseDto) {
    return `This action updates a #${id} purcachedCourse`;
  }

  remove(id: number) {
    return `This action removes a #${id} purcachedCourse`;
  }
}
