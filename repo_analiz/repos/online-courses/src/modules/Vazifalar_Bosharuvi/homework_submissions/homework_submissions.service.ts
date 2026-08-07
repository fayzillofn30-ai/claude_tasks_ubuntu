import { Injectable } from '@nestjs/common';
import { CreateHomeworkSubmissionDto } from './dto/create-homework_submission.dto';
import { UpdateHomeworkSubmissionDto } from './dto/update-homework_submission.dto';

@Injectable()
export class HomeworkSubmissionsService {
  create(createHomeworkSubmissionDto: CreateHomeworkSubmissionDto) {
    return 'This action adds a new homeworkSubmission';
  }

  findAll() {
    return `This action returns all homeworkSubmissions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} homeworkSubmission`;
  }

  update(id: number, updateHomeworkSubmissionDto: UpdateHomeworkSubmissionDto) {
    return `This action updates a #${id} homeworkSubmission`;
  }

  remove(id: number) {
    return `This action removes a #${id} homeworkSubmission`;
  }
}
