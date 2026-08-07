import { Injectable } from '@nestjs/common';
import { PermissionsService } from './permissions/permissions.service';
import { RolesService } from './roles/roles.service';
import { UsersService } from 'src/modules/users/users.service';
import { ConfigService } from '@nestjs/config';
import { CoursesService } from 'src/modules/courses/courses.service';
import { UpdateCourseDto } from 'src/modules/courses/dto/update-course.dto';
import { StafssService } from './stafss/stafss.service';
import { CreateStaffDto } from './stafss/dto/create-staff.dto';

@Injectable()
export class AdminService {
    constructor(
        private readonly permissionService : PermissionsService,
        private readonly rolesService : RolesService,
        private readonly userService :UsersService,
        private readonly staffService : StafssService,
        private readonly config : ConfigService,
        private readonly courseService : CoursesService
    ){}

    createStaff(data : CreateStaffDto){
        return this.staffService.createStaff(data)
    }

    async updateRole(data : CreateStaffDto,staffId : string){
        return this.staffService.updateStaffRole(data,staffId)
    }
    async updatePublishCourse(data : UpdateCourseDto,courseId : string){
        await this.courseService.findOne(courseId)
        return this.courseService.update(courseId,data)
    }
}
