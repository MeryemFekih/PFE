import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { PostModule } from './post/post.module';
import { CommentService } from './comment/comment.service';
import { CommentController } from './comment/comment.controller';
import { ConversationService } from './conversation/conversation.service';
import { ConversationController } from './conversation/conversation.controller';
import { MessageController } from './message/message.controller';
import { MessageService } from './message/message.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    AdminModule,
    PostModule,
  ],
  controllers: [
    AppController,
    CommentController,
    ConversationController,
    MessageController,
  ],
  providers: [
    AppService,
    PrismaService,
    CommentService,
    ConversationService,
    MessageService,
  ],
})
export class AppModule {}
