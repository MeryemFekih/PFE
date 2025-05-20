import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UploadedFile,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Patch('update-profile')
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      storage: diskStorage({
        destination: './uploads/profile-pictures',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `profile-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async updateProfile(
    @Req() req,
    @Body()
    updateData: { firstName: string; lastName: string; university: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = req.user.id;
    let profilePictureUrl: string | undefined;

    if (file) {
      profilePictureUrl = `/profile-pictures/${file.filename}`;
    }

    return this.userService.updateProfile(userId, {
      ...updateData,
      profilePicture: profilePictureUrl,
    });
  }
  @Roles('ALUMNI', 'ADMIN', 'STUDENT', 'PROFESSOR', 'PUBLIC')
  @Get('protected')
  getFullProfile(@Request() req) {
    return req.user; // ✅ This returns full user object (id, role, email, etc.)
  }
}
