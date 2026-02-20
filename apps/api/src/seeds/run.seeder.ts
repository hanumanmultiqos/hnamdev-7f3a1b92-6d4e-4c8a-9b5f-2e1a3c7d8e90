import { NestFactory } from '@nestjs/core';
import { SeederModule } from '../seeder/seeder.module'; // Import the specific module
import { SeederService } from './seeder.service';

async function bootstrap() {
  // Use SeederModule here instead of AppModule to avoid loading the whole API
  const app = await NestFactory.createApplicationContext(SeederModule);

  const seeder = app.get(SeederService);

  try {
    console.log('Starting seeding process...');
    await seeder.seed();
    console.log('Seeding finished successfully.');
  } catch (err) {
    console.error('Seeder failed', err);
    process.exit(1);
  } finally {
    await app.close();
    process.exit(0); // Explicitly kill the process so Nx knows it's done
  }
}

bootstrap();
