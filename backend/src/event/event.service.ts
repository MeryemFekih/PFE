import {
  forwardRef,
  Inject,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventCategory } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from 'src/user/user.service';
import { TwilioService } from '../notification/twilio.service';

@Injectable()
export class EventService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly twilioService: TwilioService,
  ) {}

  async addEventToPlanner(userId: number, postId: number) {
    console.log('📥 addEventToPlanner called with:', { userId, postId });

    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: {
        title: true,
        content: true,
        startDate: true,
        endDate: true,
        location: true,
        type: true,
        subject: true,
      },
    });

    if (!post) {
      console.error('❌ Post not found');
      throw new BadRequestException('Post not found');
    }

    if (post.type !== 'EVENT') {
      console.error('❌ Post is not an event');
      throw new BadRequestException('Post is not an event');
    }

    if (!post.startDate || !post.endDate) {
      console.error('❌ Missing start or end date');
      throw new BadRequestException('Start and end dates are required for event');
    }

    const category = Object.values(EventCategory).includes(post.subject as EventCategory)
      ? (post.subject as EventCategory)
      : EventCategory.OTHER;

    const createdEvent = await this.prisma.event.create({
      data: {
        id: uuidv4(),
        userId,
        title: post.title,
        description: post.content || '',
        startTime: post.startDate,
        endTime: post.endDate,
        category,
      },
    });

    console.log('✅ Event created from post:', createdEvent);
    return createdEvent;
  }

  async create(userId: number, dto: CreateEventDto) {
    const now = new Date();
    const startTime = new Date(dto.startTime);
    if (startTime < now) {
      throw new BadRequestException('Cannot create events in the past');
    }

    const event = await this.prisma.event.create({
      data: {
        id: uuidv4(),
        user: { connect: { id: userId } },
        title: dto.title,
        description: dto.description || null,
        startTime,
        endTime: new Date(dto.endTime),
        category: dto.category || EventCategory.OTHER,
        reminderAt: dto.reminderAt ? new Date(dto.reminderAt) : null,
      },
    });

    if (dto.reminderAt) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user?.phone) {
        await this.twilioService.sendSMS(
          user.phone,
          `Reminder: Your event "${event.title}" is at ${new Date(event.startTime).toLocaleString()}`
        );
      }
    }

    return event;
  }

  async update(userId: number, id: string, dto: UpdateEventDto) {
    const event = await this.prisma.event.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description || null,
        startTime: dto.startTime ? new Date(dto.startTime) : undefined,
        endTime: dto.endTime ? new Date(dto.endTime) : undefined,
        category: dto.category,
        reminderAt: dto.reminderAt ? new Date(dto.reminderAt) : undefined,
      },
    });

    if (dto.reminderAt) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user?.phone) {
        await this.twilioService.sendSMS(
          user.phone,
          `Reminder Updated: Your event "${event.title}" is at ${new Date(event.startTime).toLocaleString()}`
        );
      }
    }

    return event;
  }

  async findAll(userId: number) {
    return this.prisma.event.findMany({
      where: { userId },
      orderBy: { startTime: 'asc' },
    });
  }

  async findOne(userId: number, id: string) {
    return this.prisma.event.findFirst({ where: { id, userId } });
  }

  async remove(userId: number, id: string) {
    return this.prisma.event.delete({ where: { id } });
  }

  async getSuggestedEvents(userInterests: string[]) {
    try {
      const posts = await this.prisma.post.findMany({
        where: {
          type: 'EVENT',
          OR: [
            { subject: { in: userInterests } },
            { status: 'APPROVED', type: 'EVENT' },
          ],
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profilePicture: true,
              university: true,
            },
          },
          comments: {
            include: {
              author: {
                select: { firstName: true, lastName: true },
              },
            },
          },
        },
      });

      console.log('🎯 Suggested events fetched:', posts.length);
      return posts;
    } catch (error) {
      console.error('❌ Error fetching suggested events:', error);
      throw error;
    }
  }
}
