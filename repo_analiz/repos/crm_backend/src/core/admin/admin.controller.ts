import { Body, Controller, Param, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateRoleDto } from './roles/dto/create.role.dto';
import { UpdateCourseDto } from 'src/modules/courses/dto/update-course.dto';
import { CreateStaffDto } from './stafss/dto/create-staff.dto';

@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService : AdminService
    ){}

    @Post("create-role")
    createRole(@Body() data : CreateStaffDto){
        console.log(data)
        return this.adminService.createStaff(data)
    }

    @Post("update-role/:userId")
    updateRole(
        @Body() data : CreateStaffDto,
        @Param("userId") userId : string
    ){
        return this.adminService.updateRole(data,userId)
    }

    @Post("published-course/:id")
    updatePublish(@Body() data : UpdateCourseDto,@Param("id") courseId : string){
        return this.adminService.updatePublishCourse(data,courseId)
    }
}
