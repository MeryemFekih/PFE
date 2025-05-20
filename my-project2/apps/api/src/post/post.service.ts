/* eslint-disable @typescript-eslint/no-unsafe-return */
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
  getSavedPosts(id: any) {
    throw new Error('Method not implemented.');
  }
  unsavePost(arg0: number, id: any) {
    throw new Error('Method not implemented.');
  }
  savePost(arg0: number, id: any) {
    throw new Error('Method not implemented.');
  }
}
