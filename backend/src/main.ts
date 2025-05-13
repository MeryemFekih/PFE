import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend access
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Enable Prisma shutdown hook
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // Start the app
  const port = process.env.PORT || 4000;
  await app.listen(port);

  console.log(`🚀 Server running on http://localhost:${port}`);

  // Log registered routes
  const router = app.getHttpAdapter().getInstance();
const registeredRoutes = router._router.stack
  .filter((r) => r.route)
  .map((r) => `${Object.keys(r.route.methods)[0].toUpperCase()} ${r.route.path}`);

console.log('📚 Registered routes:\n' + registeredRoutes.join('\n'));
}

void bootstrap();
