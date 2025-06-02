import {
  Controller, Get, Patch, Body, Req, UseGuards,
  Param, Post, Delete,
  Query
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  getOwnProfile(@Req() req) {
    return this.userService.getProfile(req.user.id);
  }

  @Patch('profile')
  updateOwnProfile(@Req() req, @Body() body: Partial<any>) {
    return this.userService.updateProfile(req.user.id, body);
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
}
