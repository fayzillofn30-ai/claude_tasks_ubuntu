import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateMentorProfileDto } from './dto/create-mentor-profile.dto';
import { UpdateMentorProfileDto } from './dto/update-mentor-profile.dto';
import { UserRoles } from 'src/common/types/user.types';

@Injectable()
export class MentorProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateMentorProfileDto) {
    const { userId } = createDto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`Foydalanuvchi topilmadi (id: ${userId})`);
    }

    if (user.role !== UserRoles.MENTOR) {
      throw new BadRequestException(`Foydalanuvchi mentor emas`);
    }

    const existing = await this.prisma.mentorProfile.findUnique({
      where: { userId },
    });

    if (existing) {
      throw new BadRequestException(`Mentor profili allaqachon mavjud`);
    }

    return await this.prisma.mentorProfile.create({
      data: createDto,
    });
  }

  async findAll() {
    return await this.prisma.mentorProfile.findMany({
      include: { user: true, courses: true },
    });
  }

  async findOne(id: string) {
    const profile = await this.prisma.mentorProfile.findUnique({
      where: { id },
      include: { user: true, courses: true },
    });

    if (!profile) {
      throw new NotFoundException(`Mentor profili topilmadi (id: ${id})`);
    }

    return profile;
  }

  async update(id: string, updateDto: UpdateMentorProfileDto) {
    const profile = await this.prisma.mentorProfile.findUnique({
      where: { id },
    });

    if (!profile) {
      throw new NotFoundException(`Mentor profili topilmadi (id: ${id})`);
    }

    return await this.prisma.mentorProfile.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: string) {
    const profile = await this.prisma.mentorProfile.findUnique({
      where: { id },
    });

    if (!profile) {
      throw new NotFoundException(`Mentor profili topilmadi (id: ${id})`);
    }

    return await this.prisma.mentorProfile.delete({
      where: { id },
    });
  }
}
