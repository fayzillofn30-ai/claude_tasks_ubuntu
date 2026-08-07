import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto, VerifyDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { CacheService } from './cache.service';
import { UsersService } from 'src/modules/users/users.service';
import { EmailService } from '../email/email.service';
import { EmailCodeEnum } from '../../common/types/enum.types';
import { JwtSubService } from '../jwt/jwt.service';
import { checAlreadykExistsResurs } from '../../common/types/check.functions.types';
import { PrismaService } from '../prisma/prisma.service';
import { ModelsEnumInPrisma } from '../../common/types/global.types';
import { ConfigService } from '@nestjs/config';
import { VerifyResetDto } from './dto/verify.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly userService: UsersService,
    private readonly emilService: EmailService,
    private readonly jwtService: JwtSubService,
    private readonly prisma : PrismaService,
  ) { }

  async create(data: CreateAuthDto) {
   
    await checAlreadykExistsResurs(this.prisma,ModelsEnumInPrisma.USERS,"email",data.email)
   
    const code = Math.floor(100000 + Math.random() * 900000);
    const ttl = Date.now() + (1000 * (60 * 5))
    const emailresult = await this.emilService.sendResedPasswordVerify(data.email,code,EmailCodeEnum.REGISTER)
   
    this.cacheService.set(data.email, {
      fullname: data.fullName,
      email: data.email,
      password: data.password,
      code
    }, (1000 * (60 * 5)))
   
    return {
      message: 'This action adds a new auth',
      data: { ...data, code, time: (ttl - (Date.now())) / (1000 * 60) }
    };
  }
  
  async verifyCodeRegister(data: VerifyDto) {
    console.log(data.email)
    const olduser = this.cacheService.get(data.email)
    if (!olduser) {
      throw new BadRequestException(`${data.email} emailidagi ma'lumotlar toilmadi !`)
    }
    if (olduser.code !== data.code) {
      throw new BadRequestException("Sizning codeingiz xato kiritildi!")
    }
    this.cacheService.delete(data.email)
    const newUser = await this.userService.create({
      email: olduser.email,
      fullName: olduser.fullname,
      password: olduser.password,
      
    })
    return {
      accessToken: await this.jwtService.getAccessToken({...newUser.data,userDeleted : false}),
      refreshToken: await this.jwtService.getRefreshToken({
        ...newUser.data,
        userDeleted: false // or set appropriately based on your logic
      }),
      user : newUser
    }
  }

  async verifyResetPassword(data : VerifyResetDto){
    const olduser = this.cacheService.get(data.email)
    if (!olduser) {
      throw new BadRequestException(`${data.email} emailidagi ma'lumotlar toilmadi !`)
    }
    if (olduser.code !== Number(data.code)) {
      throw new BadRequestException("Sizning codeingiz xato kiritildi!")
    }
    this.cacheService.delete(data.email)
    const newUser = await this.userService.create({
      email: olduser.email,
      fullName: olduser.fullname,
      password: olduser.password,
    })
    return {
      accessToken: await this.jwtService.getAccessToken({...newUser.data,userDeleted : false}),
      refreshToken: await this.jwtService.getRefreshToken({
        ...newUser.data,
        userDeleted: false // or set appropriately based on your logic
      })
    }
  }

  async login(data: LoginDto) {
    console.log("data", data)
    const oldUser = await this.userService.findByEmail(data.email)
    const decodePass = await this.userService.decodePass(data.password, oldUser.password)
    const {password,...user} = oldUser
    if (decodePass) {
      return {
        accessToken: await this.jwtService.getAccessToken({...oldUser,userDeleted : false}),
        refreshToken: await this.jwtService.getRefreshToken({...oldUser,userDeleted : false}),
        user 
      }
    }else {
      throw new BadRequestException("Invalid email or password !")
    }
  }

  async resetPassword(email: string) {
    const olduser = await this.userService.findByEmail(email)
    const code = Math.floor(100000 + Math.random() * 900000);
    const ttl = Date.now() + (1000 * (60 * 5))
    const emailresult = await this.emilService.sendResedPasswordVerify(email,code,EmailCodeEnum.RESET_PASSWORD)
    if(!olduser){
      throw new BadRequestException("User not found !")
    }else{
      this.cacheService.set(email, {
        code,
        email,
        fullname : olduser?.fullName || "fullname",
        password : olduser?.password || "password",
      },(1000 * (60 * 5)))
    }

    return {
      message: 'This action resets a password',
      data: { email, code, time: (ttl - (Date.now())) / (1000 * 60) }
    };
  }

  async resetToken(userId: string) {
    const user = await this.prisma.user.findUnique({
      where : {
        id : userId
      }
    })
    if(user?.userDeleted){
      throw new BadRequestException("This user is deleted !")
    }
    if(!user){
      throw new BadRequestException("User not found !")
    }
    return {
      accessToken: await this.jwtService.getAccessToken({...user,userDeleted : false}),
    }
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId
      }
    })
    if(!user){
      throw new BadRequestException("User not found !")
    }
    const isOldPasswordValid = await this.userService.decodePass(oldPassword, user.password)
    if (!isOldPasswordValid) {
      throw new BadRequestException("Old password is incorrect !")
    }
  
    await this.userService.update(userId, { password: newPassword });
    return { message: "Password changed successfully !" };
  }
}
