import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setterAppConfigurations } from './global/set.global';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await setterAppConfigurations(app);
  app.enableCors();

  const PORT = process.env.PORT;
  const HOST = process.env.HOST;
  await app.listen(PORT ?? 3000);
  const BASE_URL = `http://${HOST}:${PORT}/api`;
  console.log(`Swagger ${BASE_URL}/swagger`);
}
bootstrap();
