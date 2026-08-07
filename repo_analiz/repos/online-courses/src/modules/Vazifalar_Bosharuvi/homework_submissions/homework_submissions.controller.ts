import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HomeworkSubmissionsService } from './homework_submissions.service';
import { CreateHomeworkSubmissionDto } from './dto/create-homework_submission.dto';
import { UpdateHomeworkSubmissionDto } from './dto/update-homework_submission.dto';

@Controller('homework-submissions')
export class HomeworkSubmissionsController {
  constructor(
    private readonly homeworkSubmissionsService: HomeworkSubmissionsService,
  ) {}

  @Post()
  create(@Body() createHomeworkSubmissionDto: CreateHomeworkSubmissionDto) {
    return this.homeworkSubmissionsService.create(createHomeworkSubmissionDto);
  }

  @Get()
  findAll() {
    return this.homeworkSubmissionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.homeworkSubmissionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateHomeworkSubmissionDto: UpdateHomeworkSubmissionDto,
  ) {
    return this.homeworkSubmissionsService.update(
      +id,
      updateHomeworkSubmissionDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.homeworkSubmissionsService.remove(+id);
  }
}
