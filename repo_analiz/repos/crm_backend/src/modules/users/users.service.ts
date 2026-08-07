import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { checkExistsResurs } from 'src/common/types/check.functions.types';
import { User } from '@prisma/client';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';
import { unlinkFile } from 'src/common/types/file.cotroller.typpes';
import * as bcrypt from 'bcrypt';
import { urlGenerator } from 'src/common/types/generator.types';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  /** 🔹 Helper: flatten user structure */
  private flattenUser(user: any) {
    if (!user) return null;
    return {
      id: user.id,
      fullName: `${user.firstName} ${user.lastName}`.trim(),
      father: user.father,
      email: user.email,
      phone: user.phone,
      image: user.image,
      birthDay: user.birthDay,
      isDeleted: user.isDeleted,
      createdAt: user.createdAt,
      roles : user.Staff && user.Staff[0]
        ? user.Staff.map(staff => {
          return {
            id: staff.id,
            role: staff.role,
            isDeleted: staff.isDeleted,
          }
        })
        : null,
    };
  }

  /** 🔸 Create user */
  async create(data: CreateUserDto, image?: Express.Multer.File) {
    const { email, phone } = data;
    const existsInEmail = await this.prisma.user.findFirst({ where: { email } });
    const existsInPhone = await this.prisma.user.findFirst({ where: { phone } });

    if (existsInPhone || existsInEmail)
      return { message: 'Already exists', user: this.flattenUser(existsInPhone || existsInEmail) };

    const hashedPass = await bcrypt.hash(data.password, 10);
    const newUser = await this.prisma.user.create({
      data: {
        ...data,
        father: data.father || '',
        image: image ? urlGenerator(this.config, image.filename) : null,
        password: hashedPass,
        isDeleted: false,
      },
      include: { Staff: true },
    });

    const {Staff} = newUser
    
    return { message: 'User created', user: this.flattenUser(newUser) };
  }

  /** 🔸 Get all users */
  async findAll() {
    const users = await this.prisma.user.findMany({
      where: { isDeleted: false },
      include: { Staff: true },
    });
    return {
      message: 'All active users',
      count: users.length,
      users: users.map((u) => this.flattenUser(u)),
    };
  }

  /** 🔸 Get one user by ID */
  async findOne(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, isDeleted: false },
      include: { Staff: true },
    });

    if (!user) throw new NotFoundException(`User not found [${id}]`);

    return { message: `User found`, user: this.flattenUser(user) };
  }

  /** 🔸 Update user */
  async update(id: string, data: UpdateUserDto) {
    const oldUser = await checkExistsResurs<User>(
      this.prisma,
      ModelsEnumInPrisma.USERS,
      'id',
      id,
    );

    if (oldUser.isDeleted) throw new NotFoundException(`User not found [${id}]`);

    if (data.email) {
      const existsEmail = await this.prisma.user.findFirst({ where: { email: data.email } });
      if (existsEmail && existsEmail.id !== id)
        throw new ConflictException('Email already exists');
    }

    if (data.phone) {
      const existsPhone = await this.prisma.user.findFirst({ where: { phone: data.phone } });
      if (existsPhone && existsPhone.id !== id)
        throw new ConflictException('Phone already exists');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
      include: { Staff: true },
    });

    return { message: 'User updated', user: this.flattenUser(updatedUser) };
  }

  /** 🔸 Soft delete user */
  async remove(id: string) {
    const oldUser = await checkExistsResurs<User>(
      this.prisma,
      ModelsEnumInPrisma.USERS,
      'id',
      id,
    );

    if (oldUser.isDeleted) throw new NotFoundException(`User not found [${id}]`);

    if (oldUser.image && typeof oldUser.image === 'string') {
      const filename = oldUser.image.split('/').at(-1);
      if (filename) unlinkFile(filename);
    }

    const deleted = await this.prisma.user.update({
      where: { id },
      data: { isDeleted: true },
      include: { Staff: true },
    });

    return { message: 'User soft-deleted', user: this.flattenUser(deleted) };
  }

  /** 🔸 Restore deleted user */
  async restore(id: string) {
    const deletedUser = await this.prisma.user.findFirst({
      where: { id, isDeleted: true },
      include: { Staff: true },
    });
    if (!deletedUser) throw new NotFoundException(`Deleted user not found [${id}]`);

    const restored = await this.prisma.user.update({
      where: { id },
      data: { isDeleted: false },
      include: { Staff: true },
    });

    return { message: 'User restored', user: this.flattenUser(restored) };
  }
}
