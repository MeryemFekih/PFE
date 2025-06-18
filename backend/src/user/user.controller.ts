import {
  Controller, Get, Patch, Body, Req, UseGuards,
  Param, Post, Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  Request
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { UserService } from './user.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';

@Controller('user')
@UseGuards(JwtAuthGuard)
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

  @Get('shared-interests')
  async getUsersWithSharedInterests(@Req() req) {
    const user = await this.userService.findById(req.user.id);
    if (!user) throw new Error('User not found');
    return this.userService.findUsersWithSharedInterests(user.id, user.interests);
  }

  @Post(':id/follow')
  followUser(@Req() req, @Param('id') id: string) {
    return this.userService.followUser(req.user.id, parseInt(id));
  }

  @Delete(':id/unfollow')
  unfollowUser(@Req() req, @Param('id') id: string) {
    return this.userService.unfollowUser(req.user.id, parseInt(id));
  }

  @Get(':id/is-following')
  checkIfFollowing(@Req() req, @Param('id') id: string) {
    return this.userService.isFollowing(req.user.id, parseInt(id));
  }

  @Get(':id/posts')
  getUserWithPosts(@Param('id') targetId: number, @Req() req) {
    return this.userService.getUserWithPosts(targetId, req.user.id, req.user.role);
  }
    @Get('batch')
  async getUsersByIds(@Query('ids') ids: string) {
    console.log('[GET /user/batch] ids:', ids);

    const idArray = ids
      .split(',')
      .map(id => parseInt(id, 10))
      .filter(id => !isNaN(id));
    return this.userService.findUsersByIds(idArray);
  }

  // 🚫 remove guard just to test
@Get('search')
async searchUsers(@Query('query') query: string) {
  console.log('🔍 Search query:', query);
  return this.userService.searchUsersByName(query || '');
}


 @UseGuards(JwtAuthGuard)
  @Get('follow-details')
  async getFollowDetails(@Req() req) {
    const userId = req.user.id;
    return this.userService.getFollowDetails(userId);
  }

}
