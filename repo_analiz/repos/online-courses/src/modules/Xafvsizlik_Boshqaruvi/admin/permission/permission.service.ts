import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UpdatePermissionDto } from '../dto/update-permission';
import { CreatePermissionDto } from '../dto/create-permission.dto';

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPermissionDto: CreatePermissionDto) {
    return await this.prisma.permission.create({
      data: createPermissionDto,
    });
  }

  async findAll() {
    return await this.prisma.permission.findMany();
  }

  async findOne(id: string) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
    });

    if (!permission) {
      throw new NotFoundException(`Permission topilmadi (id: ${id})`);
    }

    return permission;
  }

  async update(id: string, updateDto: UpdatePermissionDto) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
    });

    if (!permission) {
      throw new NotFoundException(`Permission topilmadi (id: ${id})`);
    }

    return await this.prisma.permission.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: string) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
    });

    if (!permission) {
      throw new NotFoundException(`Permission topilmadi (id: ${id})`);
    }

    return await this.prisma.permission.delete({
      where: { id },
    });
  }
}
