import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeederService } from './seeder.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const seeder = app.get(SeederService);

  try {
    await seeder.seed();
  } catch (err) {
    console.error('Seeder failed', err);
  } finally {
    await app.close();
  }
}

bootstrap();