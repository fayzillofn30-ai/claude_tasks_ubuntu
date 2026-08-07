import { Injectable } from '@nestjs/common';
import { CreateQuestionAnswerDto } from './dto/create-question_answer.dto';
import { UpdateQuestionAnswerDto } from './dto/update-question_answer.dto';

@Injectable()
export class QuestionAnswersService {
  create(createQuestionAnswerDto: CreateQuestionAnswerDto) {
    return 'This action adds a new questionAnswer';
  }

  findAll() {
    return `This action returns all questionAnswers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} questionAnswer`;
  }

  update(id: number, updateQuestionAnswerDto: UpdateQuestionAnswerDto) {
    return `This action updates a #${id} questionAnswer`;
  }

  remove(id: number) {
    return `This action removes a #${id} questionAnswer`;
  }
}
