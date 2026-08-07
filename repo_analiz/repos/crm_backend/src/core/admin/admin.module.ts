import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { PermissionsService } from './permissions/permissions.service';
import { RolesService } from './roles/roles.service';
import { UsersService } from 'src/modules/users/users.service';
import { CoursesService } from 'src/modules/courses/courses.service';
import { RomService } from 'src/modules/rom/rom.service';
import { AdminService } from './admin.service';
import { StafssService } from './stafss/stafss.service';
import { StaffsService } from 'src/modules/staffs/staffs.service';

@Module({
  controllers: [AdminController],
  providers : [
    PermissionsService,
    RolesService,
    UsersService,
    CoursesService,
    RomService,
    AdminService,
    StafssService,
    StaffsService
  ]
})
export class AdminModule {}
