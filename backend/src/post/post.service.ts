import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';

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
      participantLimit,
    } = createPostDto;

    return this.prisma.post.create({
      data: {
        title,
        content,
        type,
        eventType,
        subject,
        participantLimit,
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
  }  async savePost(postId: number, userId: number) {
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
      console.error(`Failed to unsave post ${postId} for user ${userId}:`, error);
      throw error;
    }
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
async getSuggestedEvents(userId: number) {
  console.log('🔍 Fetching suggested events for user ID:', userId);

  if (!userId) {
    console.error('❌ No userId provided');
    return [];
  }

  const user = await this.prisma.user.findUnique({
    where: { 
      id: userId 
    },
    select: { 
      interests: true 
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

  const normalized = user.interests.map(i => i.toLowerCase().trim());

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
async participateInPost(postId: number, userId: number) {
  const post = await this.prisma.post.findUnique({
    where: { id: postId },
    include: { participants: true },
  });

  if (!post) throw new Error('Post not found');
  if (post.participantLimit && post.participants.length >= post.participantLimit) {
    throw new Error('This event has reached its participant limit');
  }

  // Prevent double participation
  const existing = await this.prisma.participation.findFirst({
    where: { postId, userId }
  });

  if (existing) throw new Error('You already participated in this event');

  return this.prisma.participation.create({
    data: {
      postId,
      userId,
      name: '', // optional, from session if needed
    },
  });
}
// post.service.ts
// GET /posts/:id/participants
async getPostParticipants(postId: number, requesterId: number) {
  const post = await this.prisma.post.findUnique({
    where: { id: postId },
    select: {
      authorId: true,
      type: true,
    },
  });

  if (!post) throw new NotFoundException('Post not found');

  if (!['EVENT', 'FORMATION'].includes(post.type)) {
    throw new ForbiddenException('Participants only visible for events or formations');
  }

  if (post.authorId !== requesterId) {
    throw new ForbiddenException('Only the post owner can view participants');
  }

  return this.prisma.participation.findMany({
    where: { postId },
    include: { user: true },
  });
}



async requestParticipantRemoval(
  participationId: number,
  requesterId: number,
  reason: string,
) {
  const participation = await this.prisma.participation.findUnique({
    where: { id: participationId },
    include: { post: true },
  });

  if (!participation) throw new NotFoundException('Participation not found');

  if (participation.post.authorId !== requesterId) {
    throw new ForbiddenException('Only the post owner can request removal');
  }

  return this.prisma.participation.update({
    where: { id: participationId },
    data: {
      removalStatus: 'PENDING',
      removalReason: reason,
      removalRequestedById: requesterId,
    },
  });
}


}
