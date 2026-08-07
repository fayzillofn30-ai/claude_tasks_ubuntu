import { Injectable } from '@nestjs/common';
import { CreateLessonViewDto } from './dto/create-lesson_view.dto';
import { UpdateLessonViewDto } from './dto/update-lesson_view.dto';

@Injectable()
export class LessonViewsService {
  create(createLessonViewDto: CreateLessonViewDto) {
    return 'This action adds a new lessonView';
  }

  findAll() {
    return `This action returns all lessonViews`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lessonView`;
  }

  update(id: number, updateLessonViewDto: UpdateLessonViewDto) {
    return `This action updates a #${id} lessonView`;
  }

  remove(id: number) {
    return `This action removes a #${id} lessonView`;
  }
}
