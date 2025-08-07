import 'dotenv/config'; // ✅ Load .env first

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors(); // enable cors (if you are working with a separate frontend)

  // Validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // endpoints prefix
  app.setGlobalPrefix('api/v1');

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Ecommerce API')
    .setDescription('API for ecommerce platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // await app.listen(process.env.PORT ?? 3000);
  await app.listen(process.env.SERVER_HTTP_PORT ?? 3000);
  console.log(`server is running over http://${process.env.SERVER_HTTP_HOST}:${process.env.SERVER_HTTP_PORT}/api-docs`);
}
bootstrap();
