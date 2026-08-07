import { Controller, Post, Body, Res } from '@nestjs/common';
import { response, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthRegisterDto } from './dto/create-auth.dto';
import { Public, UserData } from 'src/global/decorators/auth.decorators';
import { JwtPayload } from 'src/common/config/jwt.secrets';
import { CreateOtpDto } from './dto/create-email.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('send-otp')
  async sendOtp(@Body() createAuthDto: CreateOtpDto, @Res() res: Response) {
    return await this.authService.sendOtp(createAuthDto);
  }

  @Public()
  @Post('register/verification')
  async registerVerification(
    @Body() otpData: CreateOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.createUserAndVerifiyCode({code :"cdscdwsd",email:otpData.email});
    return result
  }

  @Post('exists/verification')
  async existsVerification(
    @UserData() user: JwtPayload,
    @Body() data: CreateOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.verifyExistsUser(user.id, {code : "",email :data.email});

    // 🍪 Tokenlarni cookie'ga yozish
    // this.setTokensToCookies(res, result.accessToken, null, null);

    return result
  }

  // ✅ cookie yozish uchun yordamchi private metod
  private setTokensToCookies(
    res: Response,
    accessToken: string | null,
    sessionToken: string | null,
    refreshToken: string | null,
  ) {
    const secure = process.env.NODE_ENV === 'production';

    if (accessToken) {
      res.cookie('accessToken', accessToken, {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 kun
        secure: false,
      });
    }

    if (sessionToken) {
      res.cookie('sessionToken', sessionToken, {
        maxAge: 1000 * 60 * 15, // 15 daqiqa
        secure: false,
      });
    }

    if (refreshToken) {
      res.cookie('refreshToken', refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 21, // 21 kun
        secure: false,
      });
    }
  }
}
