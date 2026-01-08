import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { cleanupOpenApiDoc } from 'nestjs-zod';

import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './prisma/prisma.exception-filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: process.env.APP_FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type, Accept, Authorization',
      exposedHeaders: 'Content-Length, Content-Range',
    },
  });
  app.use(cookieParser());
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('NextBlog API')
    .setVersion('1.0')
    .build();
  const openApiDoc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, cleanupOpenApiDoc(openApiDoc), {
    jsonDocumentUrl: '/swagger/json',
    useGlobalPrefix: true,
  });

  app.useGlobalFilters(new PrismaExceptionFilter());

  await app.listen(process.env.PORT ?? 3001);
}

void bootstrap();
