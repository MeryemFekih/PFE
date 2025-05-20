/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROFESSOR', 'ALUMNI', 'ADMIN', 'STUDENT')
  @UseInterceptors(
    FileInterceptor('media', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedTypes = [
          'image/jpeg',
          'image/png',
          'image/jpg',
          'image/webp',
          'video/mp4',
          'application/pdf',
        ];

        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Unsupported file type'), false);
        }
      },
      limits: { fileSize: 20 * 1024 * 1024 }, // Optional: limit size to 20MB
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body(new ValidationPipe({ transform: true })) createPostDto: CreatePostDto,
    @Req() req,
  ) {
    const mediaUrl = file ? `/uploads/${file.filename}` : undefined;
    const post = this.postService.create(
      { ...createPostDto, mediaUrl },
      req.user.id,
    );
    return post;
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll(@Req() req) {
    return this.postService.findAllApproved(req.user);
  }

  @Get('pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getPending() {
    return this.postService.getPendingPosts();
  }

  @Patch('approve/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  approve(@Param('id') id: string) {
    return this.postService.approvePost(+id);
  }

  @Patch('reject/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  reject(@Param('id') id: string) {
    return this.postService.rejectPost(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string, @Req() req) {
    return this.postService.removeIfAuthorized(+id, req.user);
  }
  @Get('user/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  getUserPosts(@Param('id') id: string) {
    return this.postService.getPostsByUserId(+id);
  }
  @Patch(':id/save')
  @UseGuards(JwtAuthGuard)
  savePost(@Param('id') id: string, @Req() req) {
    return this.postService.savePost(+id, req.user.id);
  }

  @Patch(':id/unsave')
  @UseGuards(JwtAuthGuard)
  unsavePost(@Param('id') id: string, @Req() req) {
    return this.postService.unsavePost(+id, req.user.id);
  }

  @Get('/saved/all')
  @UseGuards(JwtAuthGuard)
  getSaved(@Req() req) {
    return this.postService.getSavedPosts(req.user.id);
  }
}
