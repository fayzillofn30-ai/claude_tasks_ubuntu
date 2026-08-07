import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StudentGroupsService } from './student-groups.service';
import { CreateStudentGroupDto } from './dto/create-student-group.dto';

@Controller('student-groups')
export class StudentGroupsController {
  constructor(private readonly studentGroupsService: StudentGroupsService) {}

  @Post("create")
  create(@Body() createStudentGroupDto: CreateStudentGroupDto) {
    return this.studentGroupsService.create(createStudentGroupDto);
  }

  @Get("getids/studentid/:id")
  getIdsByStudentId(@Param("id") id : string){
    return this.studentGroupsService.getidsbyStudenId(id)
  }

  @Get("get-full/by-roomid/:id")
  getFullStatistika(@Param("id") id : string){
    return this.studentGroupsService.getAllStatistika(id)
  }

}
