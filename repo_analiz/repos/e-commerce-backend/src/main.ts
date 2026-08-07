import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initGlobalApp } from './core/use_initilation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  initGlobalApp(app)
  await app.listen(process.env.PORT ?? 3000);

  console.log(process.env.PORT)
  console.log(process.env.APP_BASE_URL + "/api-docs")
}
bootstrap();
