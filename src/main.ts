import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.use(cookieParser());
  await app.enableCors({
    origin:'http://localhost:3000',
    credentials: true
  }) 
  await app.listen(3000);
}
bootstrap();
