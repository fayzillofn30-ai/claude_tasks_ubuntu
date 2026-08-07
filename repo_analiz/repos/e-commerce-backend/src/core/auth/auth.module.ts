import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CacheService } from './cache.service';
import { UsersService } from 'src/modules/users/users.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports : [EmailModule],
  controllers: [AuthController],
  providers: [AuthService,CacheService,UsersService],
})
export class AuthModule {}
