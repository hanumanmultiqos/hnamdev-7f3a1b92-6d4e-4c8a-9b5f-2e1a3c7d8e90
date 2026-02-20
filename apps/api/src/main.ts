import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription('API documentation for the Secure Task Management System')
    .setVersion('1.0')
    .addBearerAuth() // JWT auth
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // Swagger UI at /api

  await app.listen(3000);
  console.log('Server running on http://localhost:3000');
  console.log('Swagger docs available on http://localhost:3000/docs');
}
bootstrap();