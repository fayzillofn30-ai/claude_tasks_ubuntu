import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const exists = await this.prisma.user.findUnique({
      where: { phoneNumber: createUserDto.phoneNumber },
    });

    if (exists) {
      throw new BadRequestException(
        `Bu telefon raqam allaqachon ro'yxatdan o'tgan: ${createUserDto.phoneNumber}`,
      );
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Foydalanuvchi topilmadi (id: ${id})`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    if (
      updateUserDto.phoneNumber &&
      updateUserDto.phoneNumber !== user.phoneNumber
    ) {
      const exists = await this.prisma.user.findUnique({
        where: { phoneNumber: updateUserDto.phoneNumber },
      });

      if (exists) {
        throw new BadRequestException(
          `Bu telefon raqam boshqa foydalanuvchiga tegishli: ${updateUserDto.phoneNumber}`,
        );
      }
    }

    let password: string | undefined = undefined;
    if (updateUserDto.password) {
      password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        ...(password && { password }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
