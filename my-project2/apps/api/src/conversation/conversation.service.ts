import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) {}

  async createConversation(userId: number) {
    return this.prisma.conversation.create({
      data: { userId },
    });
  }

  async getConversationsByUser(userId: number) {
    return this.prisma.conversation.findMany({
      where: { userId },
      orderBy: { startedAt: 'desc' },
      include: { messages: true },
    });
  }

  async getConversationById(id: number, userId: number) {
    return this.prisma.conversation.findFirst({
      where: { id, userId },
      include: { messages: true },
    });
  }
}
