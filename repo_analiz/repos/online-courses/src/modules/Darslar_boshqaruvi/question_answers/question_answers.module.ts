import { Module } from '@nestjs/common';
import { QuestionAnswersService } from './question_answers.service';
import { QuestionAnswersController } from './question_answers.controller';

@Module({
  controllers: [QuestionAnswersController],
  providers: [QuestionAnswersService],
})
export class QuestionAnswersModule {}
