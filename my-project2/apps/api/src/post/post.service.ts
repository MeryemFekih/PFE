/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPostDto: CreatePostDto, userId: number) {
    return this.prisma.post.create({
      data: {
        ...createPostDto,
        authorId: userId,
        visibility: createPostDto.visibility,
      },
    });
  }

  findAllApproved(user: any) {
    const role = user?.role || 'PUBLIC';

    return this.prisma.post.findMany({
      where: {
        status: 'APPROVED',
        ...(role === 'PUBLIC' ? { visibility: 'PUBLIC' } : {}), //This filter will now work
      },
      include: {
        author: true,
        comments: {
          include: {
            author: { select: { firstName: true, lastName: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
      include: { author: true },
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
      data: { status: 'APPROVED', approvedAt: new Date() },
    });
  }

  rejectPost(id: number) {
    return this.prisma.post.update({
      where: { id },
      data: { status: 'REJECTED' },
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
  async removeIfAuthorized(postId: number, user: any) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });

    if (!post) throw new Error('Post not found');

    if (user.role !== 'ADMIN' && post.authorId !== user.id) {
      throw new Error('Unauthorized');
    }

    return this.prisma.post.delete({ where: { id: postId } });
  }
  async getPostsByUserId(userId: number) {
    return this.prisma.post.findMany({
      where: { authorId: userId, status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profilePicture: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                firstName: true,
                lastName: true,
                profilePicture: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }
  async unsavePost(postId: number, userId: number) {
    console.log(`Attempting to unsave post ${postId} for user ${userId}`);
    try {
      const result = await this.prisma.user.update({
        where: { id: userId },
        data: {
          savedPosts: {
            disconnect: { id: postId },
          },
        },
        include: {
          savedPosts: true,
        },
      });
      console.log(`✅ Successfully unsaved post ${postId} for user ${userId}`);
      return result;
    } catch (error) {
      console.error(
        `Failed to unsave post ${postId} for user ${userId}:`,
        error,
      );
      throw error;
    }
  }
  async savePost(postId: number, userId: number) {
    console.log(`Attempting to save post ${postId} for user ${userId}`);
    try {
      // First check if the post exists and is approved
      const post = await this.prisma.post.findUnique({
        where: { id: postId, status: 'APPROVED' },
      });

      if (!post) {
        console.error(`Post ${postId} not found or not approved`);
        throw new Error('Post not found or not approved');
      }

      const result = await this.prisma.user.update({
        where: { id: userId },
        data: {
          savedPosts: {
            connect: { id: postId },
          },
        },
        include: {
          savedPosts: true,
        },
      });
      console.log(`✅ Successfully saved post ${postId} for user ${userId}`);
      return result;
    } catch (error) {
      console.error(`Failed to save post ${postId} for user ${userId}:`, error);
      throw error;
    }
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
  async getSuggestedEvents(userId: number) {
    console.log('🔍 Fetching suggested events for user ID:', userId);

    if (!userId) {
      console.error('❌ No userId provided');
      return [];
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        interests: true,
      },
    });

    if (!user) {
      console.warn('⚠️ User not found');
      return [];
    }

    if (!user.interests?.length) {
      console.warn('⚠️ No interests found for user');
      return [];
    }

    console.log('🎯 User interests:', user.interests);

    const normalized = user.interests.map((i) => i.toLowerCase().trim());

    const results = await this.prisma.post.findMany({
      where: {
        type: 'EVENT',
        subject: { in: normalized, mode: 'insensitive' },
        status: 'APPROVED',
      },
      include: { author: true, comments: true },
    });

    console.log(`✅ Found ${results.length} suggested events`);
    return results;
  }

}
