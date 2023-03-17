import { HttpException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exception/httpException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   app.use(cookieParser());
   app.enableCors({
    origin:'http://localhost:3000',
    credentials: true
  });
  // app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}
bootstrap();
