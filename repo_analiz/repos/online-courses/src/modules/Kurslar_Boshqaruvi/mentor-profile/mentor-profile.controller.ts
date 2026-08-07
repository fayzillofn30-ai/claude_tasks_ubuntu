import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MentorProfileService } from './mentor-profile.service';
import { CreateMentorProfileDto } from './dto/create-mentor-profile.dto';
import { UpdateMentorProfileDto } from './dto/update-mentor-profile.dto';
import { Models } from 'src/common/types/auth.types';
import { Permission, Public } from 'src/global/decorators/auth.decorators';

@Public()
@Permission(Models.MENTOR_PROFILE)
@Controller(Models.MENTOR_PROFILE)
export class MentorProfileController {
  constructor(private readonly mentorProfileService: MentorProfileService) {}

  @Post()
  create(@Body() data: CreateMentorProfileDto) {
    return this.mentorProfileService.create(data);
  }

  @Get()
  findAll() {
    return this.mentorProfileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mentorProfileService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateMentorProfileDto) {
    return this.mentorProfileService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mentorProfileService.remove(id);
  }
}
