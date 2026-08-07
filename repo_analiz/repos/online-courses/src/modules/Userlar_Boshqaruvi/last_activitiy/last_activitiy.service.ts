import { Injectable } from '@nestjs/common';
import { CreateLastActivitiyDto } from './dto/create-last_activitiy.dto';
import { UpdateLastActivitiyDto } from './dto/update-last_activitiy.dto';

@Injectable()
export class LastActivitiyService {
  create(createLastActivitiyDto: CreateLastActivitiyDto) {
    return 'This action adds a new lastActivitiy';
  }

  findAll() {
    return `This action returns all lastActivitiy`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lastActivitiy`;
  }

  update(id: number, updateLastActivitiyDto: UpdateLastActivitiyDto) {
    return `This action updates a #${id} lastActivitiy`;
  }

  remove(id: number) {
    return `This action removes a #${id} lastActivitiy`;
  }
}
