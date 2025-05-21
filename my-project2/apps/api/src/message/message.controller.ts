import { Controller, Get, Post, Param, Request, Body } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('messages')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post()
  async sendMessage(
    @Body() body: { conversationId: number; content: string },
    @Request() req,
  ) {
    // Save user's message to DB
    const userMessage = await this.messageService.addMessage(
      body.conversationId,
      'user',
      body.content,
    );

    // Optionally: return updated message history
    const updatedMessages = await this.messageService.getMessages(
      body.conversationId,
    );

    return {
      message: 'User message saved successfully',
      userMessage,
      updatedMessages,
    };
  }

  @Get(':conversationId')
  getMessages(@Param('conversationId') id: string) {
    return this.messageService.getMessages(Number(id));
  }
  @Post('assistant')
  async saveAssistantMessage(
    @Body() body: { conversationId: number; content: string },
  ) {
    const assistantMessage = await this.messageService.addMessage(
      body.conversationId,
      'assistant',
      body.content,
    );

    return {
      message: 'Assistant message saved successfully',
      assistantMessage,
    };
  }
}
