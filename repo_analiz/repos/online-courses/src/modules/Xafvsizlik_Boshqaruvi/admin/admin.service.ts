import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UserRoles } from 'src/common/types/user.types';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAdminDto: CreateAdminDto) {
    const { userId, role } = createAdminDto;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`Foydalanuvchi topilmadi (id: ${userId})`);
    }

    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        role: role,
      },
    });
  }

  async findAll() {
    return await this.prisma.user.findMany({
      where: {
        role: {
          in: [UserRoles.ADMIN, UserRoles.MENTOR, UserRoles.ASSISTANT],
        },
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (
      !user ||
      ![UserRoles.ADMIN, UserRoles.MENTOR, UserRoles.ASSISTANT].includes(
        user.role as UserRoles,
      )
    ) {
      throw new NotFoundException(`Admin yoki mentor topilmadi (id: ${id})`);
    }

    return user;
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Foydalanuvchi topilmadi (id: ${id})`);
    }

    return await this.prisma.user.update({
      where: { id },
      data: {
        role: UserRoles.STUDENT, // yoki default role
      },
    });
  }
}
