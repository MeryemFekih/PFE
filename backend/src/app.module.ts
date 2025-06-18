import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { TasksModule } from './task/task.module';
import { EventModule } from './event/event.module';
import { NotificationsModule } from './notification/notifications.module';
import { PostModule } from './post/post.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MessageModule } from './message/message.module'; // ✅

import { ConversationModule } from './conversation/conversation.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    AdminModule,
    UserModule,
    TasksModule,
    EventModule,
    NotificationsModule,
    PostModule,
    MessageModule,
    ConversationModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // 👈 should point to the actual uploads folder
      serveRoot: '/uploads', // 👈 matches the prefix you use in mediaUrl
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads/profile-pictures'), // 👈 should point to the actual profile-pictures folder
      serveRoot: '/profile-pictures', // 👈 matches the prefix you use in mediaUrl
    }),
   
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
