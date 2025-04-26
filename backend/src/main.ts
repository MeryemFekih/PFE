import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for the frontend running on port 3000
  app.enableCors();

  // Start the backend on port 3001
  await app.listen(3001);
}

bootstrap();
