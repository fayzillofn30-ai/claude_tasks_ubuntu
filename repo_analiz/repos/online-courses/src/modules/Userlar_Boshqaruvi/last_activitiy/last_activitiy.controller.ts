import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LastActivitiyService } from './last_activitiy.service';
import { CreateLastActivitiyDto } from './dto/create-last_activitiy.dto';
import { UpdateLastActivitiyDto } from './dto/update-last_activitiy.dto';

@Controller('last-activitiy')
export class LastActivitiyController {
  constructor(private readonly lastActivitiyService: LastActivitiyService) {}

  @Post()
  create(@Body() createLastActivitiyDto: CreateLastActivitiyDto) {
    return this.lastActivitiyService.create(createLastActivitiyDto);
  }

  @Get()
  findAll() {
    return this.lastActivitiyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lastActivitiyService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLastActivitiyDto: UpdateLastActivitiyDto,
  ) {
    return this.lastActivitiyService.update(+id, updateLastActivitiyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lastActivitiyService.remove(+id);
  }
}
