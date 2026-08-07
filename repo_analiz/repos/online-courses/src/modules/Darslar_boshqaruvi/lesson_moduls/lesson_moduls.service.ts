import { Injectable } from '@nestjs/common';
import { CreateLessonModulDto } from './dto/create-lesson_modul.dto';
import { UpdateLessonModulDto } from './dto/update-lesson_modul.dto';

@Injectable()
export class LessonModulsService {
  create(createLessonModulDto: CreateLessonModulDto) {
    return 'This action adds a new lessonModul';
  }

  findAll() {
    return `This action returns all lessonModuls`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lessonModul`;
  }

  update(id: number, updateLessonModulDto: UpdateLessonModulDto) {
    return `This action updates a #${id} lessonModul`;
  }

  remove(id: number) {
    return `This action removes a #${id} lessonModul`;
  }
}
