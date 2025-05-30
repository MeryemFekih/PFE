import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPostDto: CreatePostDto, userId: number, mediaUrl?: string) {
    const {
      title,
      content,
      type,
      eventType,
      subject,
      startDate,
      endDate,
      location,
      speakerId,
      visibility,
    } = createPostDto;

    return this.prisma.post.create({
      data: {
        title,
        content,
        type,
        eventType,
        subject,
        visibility,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        location,
        speakerId,
        mediaUrl,
        authorId: userId,
      },
    });
  }

  findAllApproved() {
    return this.prisma.post.findMany({
      where: { status: 'APPROVED' },
      include: {
        author: true,
        comments: {
          include: {
            author: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.post.findUnique({
      where: {id : id},
      include: {
        author: true,
        comments: {
          include: {
            author: true,
          },
        },
      },
    });
  }

  getPendingPosts() {
    return this.prisma.post.findMany({
      where: { status: 'PENDING' },
      include: { author: true },
    });
  }

  approvePost(id: number) {
    return this.prisma.post.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedAt: new Date(),
      },
    });
  }

  rejectPost(id: number) {
    return this.prisma.post.update({
      where: { id },
      data: {
        status: 'REJECTED',
      },
    });
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return this.prisma.post.update({
      where: { id },
      data: updatePostDto,
    });
  }

  remove(id: number) {
    return this.prisma.post.delete({
      where: { id },
    });
  }
  async savePost(postId: number, userId: number) {
    console.log(`✅ Saved post ${postId} for user ${userId}`);
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        savedPosts: {
          connect: { id: postId },
        },
      },
    });
  }

  async unsavePost(postId: number, userId: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        savedPosts: {
          disconnect: { id: postId },
        },
      },
    });
  }
  getPostsByUser(userId: number) {
    return this.prisma.post.findMany({
      where: {
        authorId: userId,
        status: 'APPROVED',
      },
      include: {
        author: true,
        comments: {
          include: {
            author: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSavedPosts(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        savedPosts: {
          where: { status: 'APPROVED' },
          include: {
            author: true,
            comments: {
              include: {
                author: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    return user?.savedPosts ?? [];
  }


// posts.service.ts

async getSuggestions(userId: number) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    include: {
      following: { select: { id: true } }, // users they follow
    },
  });

  if (!user) return { events: [], followedPosts: [] };

  const events = await this.prisma.post.findMany({
    where: {
      type: 'EVENT',
      subject: { in: user.interests },
      visibility: 'PUBLIC',
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: { author: true },
  });

  const followedPosts = await this.prisma.post.findMany({
    where: {
      authorId: { in: user.following.map((u) => u.id) },
      visibility: 'PUBLIC',
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: { author: true },
  });

  return {
    events,
    followedPosts,
  };
}
}
