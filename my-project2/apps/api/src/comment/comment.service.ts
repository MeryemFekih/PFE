import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async createComment(postId: number, authorId: number, text: string) {
    return this.prisma.comment.create({
      data: {
        text,
        postId,
        authorId,
      },
    });
  }

  async getCommentsForPost(postId: number) {
    return this.prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
      include: {
        author: {
          select: { firstName: true, lastName: true, profilePicture: true },
        },
      },
    });
  }
}
