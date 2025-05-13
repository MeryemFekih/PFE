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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    AdminModule,
    UserModule,
    TasksModule, 
    EventModule, 
    NotificationsModule, 
    PostModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService ,  
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }, ],

})
export class AppModule {}
