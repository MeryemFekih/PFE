/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post as HttpPost,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Response } from 'express';
import { createReadStream } from 'fs';
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @HttpPost()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROFESSOR', 'ALUMNI', 'STUDENT')
  @UseInterceptors(
    FileInterceptor('media', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = join(__dirname, '..', '..', 'uploads', 'posts');
          fs.mkdirSync(uploadPath, { recursive: true }); // ✅ Creates the directory if it doesn't exist
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}${ext}`;
          cb(null, fileName);
        },
      }),
    })
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createPostDto: CreatePostDto,
    @Req() req
  ) {
    const mediaUrl = file ? `/uploads/posts/${file.filename}` : undefined;
    return this.postService.create(createPostDto, req.user.id, mediaUrl);
    console.log('📦 Body:', req.body);
    console.log('📎 File:', file?.originalname, file?.path);

  }

  @Get()
  findAll() {
    return this.postService.findAllApproved();
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
@Get('saved')
@UseGuards(JwtAuthGuard)
getSavedPosts(@Req() req) {
    console.log('📥 Incoming request from user:', req.user);

  return this.postService.getSavedPosts(req.user.id);
}

@HttpPost(':id/save')
@UseGuards(JwtAuthGuard)
savePost(@Param('id') postId: number, @Req() req) {
  console.log('👉 Saving post:', postId, 'by user:', req.user.id);

  return this.postService.savePost(+postId, req.user.id);
}

@Delete(':id/unsave')
@UseGuards(JwtAuthGuard)
unsavePost(@Param('id') postId: number, @Req() req) {
  return this.postService.unsavePost(+postId, req.user.id);
}

  @Get('user/:id')
  @UseGuards(JwtAuthGuard)
  getPostsByUser(@Param('id') id: string) {
    return this.postService.getPostsByUser(+id);
  }

@Get(':id')
findOne(@Param('id') id: string) {
  return this.postService.findOne(+id);
}

@Get('download/:filename')
@UseGuards(JwtAuthGuard)
async download(@Param('filename') filename: string, @Res() res: Response) {
  const filePath = join(__dirname, '..', '..', 'uploads', 'posts', filename);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found' });
  }

  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  const fileStream = createReadStream(filePath);
  fileStream.pipe(res);
}
@Get('suggestions/:userId')
async getSuggestions(@Param('userId') userId: string) {
  return this.postService.getSuggestions(Number(userId));
}

}