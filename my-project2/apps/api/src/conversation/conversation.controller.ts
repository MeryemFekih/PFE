/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, Get, Post, Param, Request } from '@nestjs/common';
import { ConversationService } from './conversation.service';

@Controller('conversations')
export class ConversationController {
  constructor(private conversationService: ConversationService) {}

  @Post()
  create(@Request() req) {
    return this.conversationService.createConversation(req.user.id);
  }

  @Get()
  findAll(@Request() req) {
    return this.conversationService.getConversationsByUser(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.conversationService.getConversationById(
      Number(id),
      req.user.id,
    );
  }
}
