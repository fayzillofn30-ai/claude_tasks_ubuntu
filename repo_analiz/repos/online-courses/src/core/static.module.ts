// src/static/static.module.ts
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads', 'courses'),
      serveRoot: '/uploads', // URL prefix
    }),
  ],
})
export class StaticModule {}
