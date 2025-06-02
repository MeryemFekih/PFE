import { PrismaService } from 'src/prisma/prisma.service';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [PostController],
  providers: [PostService, PrismaService],
})
export class PostModule {}
