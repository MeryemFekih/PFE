import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async addMessage(
    conversationId: number,
    role: 'user' | 'assistant',
    content: string,
  ) {
    return this.prisma.message.create({
      data: { conversationId, role, content },
    });
  }

  async getMessages(conversationId: number) {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
