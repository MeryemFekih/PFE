import { forwardRef, Inject, Injectable, BadRequestException } from '@nestjs/common';
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
    return this.prisma.event.findMany({ where: { userId } });
  }

  async findOne(userId: number, id: string) {
    return this.prisma.event.findFirst({ where: { id, userId } });
  }

  async remove(userId: number, id: string) {
    return this.prisma.event.delete({ where: { id } });
  }
}
