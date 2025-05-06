import { PrismaService } from 'src/prisma/prisma.service';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Module } from '@nestjs/common';
import { CommentService } from 'src/comment/comment.service';

@Module({
  controllers: [PostController],
  providers: [PostService, CommentService, PrismaService],
})
export class PostModule {}
