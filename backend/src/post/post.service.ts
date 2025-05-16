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
      where: { id },
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
}
