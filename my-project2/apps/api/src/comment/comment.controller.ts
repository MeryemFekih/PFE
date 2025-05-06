/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':postId')
  async createComment(
    @Param('postId') postId: string,
    @Body('text') text: string,
    @Req() req,
  ) {
    return this.commentService.createComment(+postId, req.user.id, text);
  }

  @Get('post/:postId')
  async getComments(@Param('postId') postId: string) {
    return this.commentService.getCommentsForPost(+postId);
  }
}
