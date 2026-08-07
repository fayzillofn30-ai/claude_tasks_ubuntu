import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { JwtSubModule } from './jwt/jwt.module';
import { RedisSubModule } from './redis/redis.module';
import { StaticModule } from './static.module';

@Module({
  imports: [StaticModule, PrismaModule, JwtSubModule, RedisSubModule],
})
export class CoreModule {}
