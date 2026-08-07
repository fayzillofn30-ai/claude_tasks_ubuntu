import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PermissionService } from './permission/permission.service';
import { RoleService } from './role/role.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, PermissionService, RoleService],
})
export class AdminModule {}
