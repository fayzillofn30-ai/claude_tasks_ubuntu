import { Controller, Get, Post, Body, Patch, Param, Delete, Res, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, VerifyDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { Public, UserData } from 'src/global/decorators/auth.decorators';
import { JwtPayload } from 'src/common/types/jwt.typs';
import { VerifyResetDto } from './dto/verify.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  @Post("register")
  @Public()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Public()
  @Post("verify-register")
  async verify(
    @Body() data: VerifyDto,
    @Res() res: Response
  ) {
    const { accessToken, refreshToken ,user } = await this.authService.verifyCodeRegister(data)
    
    res.cookie('accessToken', accessToken)
    res.cookie('refreshToken', refreshToken)
    res.statusCode = 201
    res.send({ accessToken, refreshToken,user })
  }

  @Public()
  @Post("login")
  async login(
    @Body() data: LoginDto,
    @Res() res: Response
  ) {
    const { accessToken, refreshToken,user } = await this.authService.login(data)
    res.cookie('accessToken', accessToken)
    res.cookie('refreshToken', refreshToken)
    res.statusCode = 201
    res.send({ accessToken, refreshToken,user })
  }

  @Get("reset-token")
  resetToken(@UserData() user: JwtPayload) {
    return this.authService.resetToken(user.id);
  }

  @Post("change-password")
  changePassword(@UserData() user: JwtPayload, @Body('oldPassword') oldPassword: string, @Body('newPassword') newPassword: string) {
    return this.authService.changePassword(user.id, oldPassword, newPassword);
  }


  @Public()
  @Post("reset-password")
  resetPassword(@Body('email') email: string) {
    return this.authService.resetPassword(email);
  }


  @Public()
  @Post("verify-reset-password")
  verifyResetPassword(@Body() data: VerifyResetDto) {
    return this.authService.verifyResetPassword(data);
  }

}
