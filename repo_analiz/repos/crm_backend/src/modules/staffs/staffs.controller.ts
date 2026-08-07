import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StaffsService } from './staffs.service';

@Controller('staffs')
export class StaffsController {
  constructor(private readonly staffsService: StaffsService) { }

  // === TEACHER GET ===
  @Get("get-all/teacher/by-groupid/:groupId")
  findAllTeachers(@Param("groupId") groupId: string) {
    return this.staffsService.getAll_Teacher_ByGrouoId(groupId);
  }

  @Get("get-all/teacher/by-courseid/:courseId")
  getAll_Teachers_ByCourseId(@Param("courseId") courseId: string) { 
    return this.staffsService.getAll_Teachers_ByCourseId(courseId)
  }

  @Get("get-one/teacher/by-staffid/:id")
  get_One_Teacher_ByTeacherId(@Param("id") id : string){
    return this.staffsService.getOne_Teacher_ByTeacherId(id)
  }

  // ===  STUDENT  GET  ===
  @Get("get-all/studet/by-groupid/:groupId")
  findAllStudents(@Param("groupId") groupId: string) {
    return this.staffsService.getAll_Students_ByGroupId(groupId);
  }

  @Get('get-all/student/by-courseid/:courseiId')
  getAll_Students_ByCourseId(@Param('courseiId') courseiId: string) {
    return this.staffsService.gettAll_Students_ByCourseId(courseiId)
  }

  @Get("get-one/teacher/by-staffid/:id")
  get_One_Student_ByStudentId(@Param("id") id : string){
    return this.staffsService.getOne_Teacher_ByTeacherId(id)
  }


  // === STAFF GET ====
  @Get("get-all/staffs")
  getAll_Staffs(){
    return this.staffsService.getAll_Staffs()
  }


  @Get("get-all/teachers")
  getAllTeachers(){
    return this.staffsService.getAll_Teachers()
  }

  @Get("get-all/students")
  getAll_Students(){
    return this.staffsService.getAll_Students()
  }

  @Get("get-one/by-staffid/:id")
  getOne_Staff(@Param("id") id :string){
    return this.staffsService.getOne_Staff_ByStaffId(id)
  }

}
