// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshStrategy } from './strategies/refresh-token.strategy';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from './guards/roles/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import jwtConfig from './config/jwt.config';
import refreshConfig from './config/refresh.config';
import { EventModule } from 'src/event/event.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // 
    ConfigModule.forFeature(jwtConfig),        // ✅ required for jwtConfig
    ConfigModule.forFeature(refreshConfig), // Load .env
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'), // ✅ reads from .env
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
    EventModule, 
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    PrismaService,
    LocalStrategy,
    JwtStrategy,
    RefreshStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AuthModule {}
