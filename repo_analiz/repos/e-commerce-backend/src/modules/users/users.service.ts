import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { urlGenerator } from 'src/common/types/generator.types';
import { checAlreadykExistsResurs, checkExistsResurs } from 'src/common/types/check.functions.types';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';
import { userFindOneEntity } from './entities/user.entity';
import { User } from '@prisma/client';
import { unlinkFile } from 'src/common/types/file.cotroller.typpes';
import * as bcrypt from "bcrypt"

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService
  ) { }

  async create(data: CreateUserDto, avatar?: string) {
    console.log(data, avatar)
    await checAlreadykExistsResurs(this.prisma, ModelsEnumInPrisma.USERS, "email", data.email)
    if (avatar) {
      avatar = urlGenerator(this.config, avatar)
    }else{
      avatar = "https://www.w3schools.com/howto/img_avatar.png"
    }
    const hashedPass = await bcrypt.hashSync(data.password, parseInt(this.config.get<string>("BCRYPT_SALT_ROUNDS") || "10"))
    data.password = hashedPass || data.password
    console.log(hashedPass)
    const newUser = await this.prisma.user.create({
      data: {...data,avatar},
      select: userFindOneEntity
    })
    return {
      message: "Siz muoffaqqiyatli ro'yhatdan o'tdingiz",
      data: newUser
    };
  }

  async updateavatar(id: string, avatarName: string) {
    const avatar = urlGenerator(this.config, avatarName)
    const oldUser = await checkExistsResurs<User>(this.prisma, ModelsEnumInPrisma.USERS, "id", id)
    if (oldUser.userDeleted) {
      throw new HttpException("User is deleted", 400)
    }
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: id },
        data: { avatar: avatar },
        select: userFindOneEntity
      })
      if (oldUser.avatar) {
        if (typeof oldUser.avatar.split("/").at(-1) === 'string') {
          const filename = oldUser.avatar.split("/").at(-1)
          unlinkFile(filename || "")
        }
      }
      return {
        data: updatedUser,
        message: "Useravatar update successfully"
      }
    } catch (error) {

    }
  }

  async findAll() {
    const users = await this.prisma.user.findMany({ where: { userDeleted: false }, select: userFindOneEntity })
    return {
      message: `This action returns all users`,
      data: users
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { AND: [{ id: id }, { userDeleted: false }] },
      select: { ...userFindOneEntity }
    })
    if (!user) {
      throw new NotFoundException("User not found ")
    }
    console.log(user)
    return {
      message: `This action returns a [ ${id} ] user`,
      user
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, userDeleted: false },
      select: { ...userFindOneEntity }
    })
    if (!user) {
      throw new NotFoundException("User not found ")
    }
    return {
      message: `This action returns a [ ${userId} ] user`,
      data: user
    };
  }

  async update(id: string, data: UpdateUserDto, avatar?: string) {
    const oldUser = await checkExistsResurs<User>(this.prisma, ModelsEnumInPrisma.USERS, "id", id)
    if (oldUser.userDeleted) {
      throw new HttpException("User is deleted", 400)
    }
    if (data.email) {
      await checAlreadykExistsResurs(this.prisma, ModelsEnumInPrisma.USERS, "email", data.email)
    }
    if (data.password) {
      const hashedPass = await bcrypt.hashSync(data.password, parseInt(this.config.get<string>("BCRYPT_SALT_ROUNDS") || "10"))
      data.password = hashedPass
    }

    if (avatar) {
      data['avatar'] = urlGenerator(this.config, avatar)
      if (oldUser.avatar) {
        if (typeof oldUser.avatar.split("/").at(-1) === 'string') {
          const filename = oldUser.avatar.split("/").at(-1)
          unlinkFile(filename || "")
        }
      }
    }else{
      data['avatar'] = oldUser.avatar || "https://www.w3schools.com/howto/img_avatar.png"
    }

    try {
      const updatedUser = await this.prisma.user.update({ where: { id: id }, data: data, select: userFindOneEntity })
      return {
        message: `This action updates a #${id} user`,
        updatedUser
      };
    } catch (error) {
      console.log(error)
      throw new HttpException(`Userning ma'lumotlarini yangilashda hatolik`, 500)
    }
  }

  async remove(id: string) {
    await this.findOne(id)
    const oldUser = await checkExistsResurs<User>(this.prisma, ModelsEnumInPrisma.USERS, "id", id)
    try {

      const deletedUser = await this.prisma.user.update({ where: { id: id }, data: { userDeleted: true }, select: userFindOneEntity })

      return {
        message: `This action deleted a #${id} user`,
        deletedUser
      };
    } catch (error) {
      console.log(error)
      throw new HttpException(`Userni o'chirishda hatolik`, 500)
    }
  }

  async findByEmail(email: string): Promise<User> {
    return checkExistsResurs<User>(this.prisma, ModelsEnumInPrisma.USERS, "email", email)
  }

  async decodePass(password: string, userPassword: string) {
    console.log(userPassword, password)
    return bcrypt.compareSync(password, userPassword)
  }

  async updateImage(id: string, avatar: string) {
    const oldUser = await checkExistsResurs<User>(this.prisma, ModelsEnumInPrisma.USERS, "id", id)
    avatar = urlGenerator(this.config, avatar)
    if (oldUser.avatar) {
      if (typeof oldUser.avatar.split("/").at(-1) === 'string') {
        const filename = oldUser.avatar.split("/").at(-1)
        unlinkFile(filename || "")
      }
    }

    const updatedUser = await this.prisma.user.update({
      where : {id : id},data : {avatar},select : userFindOneEntity
    })
    return {
      updatedUser
    }
  }
}
