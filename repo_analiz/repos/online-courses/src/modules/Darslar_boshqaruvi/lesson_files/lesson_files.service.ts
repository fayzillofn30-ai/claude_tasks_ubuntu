import { Injectable } from '@nestjs/common';
import { CreateLessonFileDto } from './dto/create-lesson_file.dto';
import { UpdateLessonFileDto } from './dto/update-lesson_file.dto';

@Injectable()
export class LessonFilesService {
  create(createLessonFileDto: CreateLessonFileDto) {
    return 'This action adds a new lessonFile';
  }

  findAll() {
    return `This action returns all lessonFiles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lessonFile`;
  }

  update(id: number, updateLessonFileDto: UpdateLessonFileDto) {
    return `This action updates a #${id} lessonFile`;
  }

  remove(id: number) {
    return `This action removes a #${id} lessonFile`;
  }
}
