import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Prisma bilan muvaffaqiyatli ulandi');
    } catch (error) {
      console.error('❌ Prisma ulanishda xatolik:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('🛑 Prisma uzildi');
  }
}
