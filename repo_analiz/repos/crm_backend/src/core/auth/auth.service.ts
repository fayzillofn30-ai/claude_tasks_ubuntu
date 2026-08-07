import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { CacheService } from './cache.service';
import { EmailCodeEnum } from 'src/common/types/enum.types';
import { JwtSubService } from '../jwt/jwt.service';
import { CreateOtpDto } from './dto/create-email.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtSubService,
    private readonly emailService: EmailService,
    private readonly cacheService: CacheService,
  ) {}

  // 📩 1. OTP yuborish
  async sendOtp(data: CreateOtpDto) {

    // 🔢 Random 6 xonali kod
    const code = Math.floor(100000 + Math.random() * 900000);

    await this.emailService.sendResedPasswordVerify(
      data.email,
      code,
      EmailCodeEnum.REGISTER,
    );

    // ⏱️ Cache’da 5 daqiqa saqlaymiz
    this.cacheService.set(data.email, { email: data.email, code }, 1000 * 60 * 5);

  }

  // ✅ 2. Mavjud foydalanuvchini tasdiqlash
  async verifyExistsUser(userId: string, data: { email: string; code: string }) {
    const cache = this.cacheService.get(data.email);
    if (!cache || cache.code !== Number(data.code)) {
      throw new BadRequestException('Invalid or expired OTP code');
    }
    return data
  }

  // 🧑‍💻 3. Yangi foydalanuvchini yaratish va kodni tekshirish
  async createUserAndVerifiyCode(data: { email: string; code: string }) {
    const cache = this.cacheService.get(data.email);

    if (!cache || cache.code !== Number(data.code)) {
      throw new BadRequestException('Invalid or expired OTP code');
    }

  }
}
