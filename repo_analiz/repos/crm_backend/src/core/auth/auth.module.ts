import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ImageGenerator } from 'src/common/types/generator.types';
import { CacheService } from './cache.service';
import { EmailService } from '../email/email.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService,ImageGenerator,CacheService,EmailService],
})
export class AuthModule {}
