import {
  Controller, Get, Patch, Param, Body, HttpCode, Post, NotFoundException
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserService } from 'src/user/user.service';
import { AdminService } from './admin.service';
import { PrismaService } from 'src/prisma/prisma.service';

// admin.controller.ts
@Controller('admin')
@Roles('ADMIN')
export class AdminController {
  constructor(
    private userService: UserService,
    private adminService: AdminService,
    private prisma: PrismaService,
  ) {}

  @Get('pending-users')
  getPendingUsers() {
    return this.userService.findPending();
  }

  @Patch('approve/:id')
  approveUser(@Param('id') id: number) {
    return this.userService.approveUser(+id);
  }

  @Patch('reject/:id')
  @HttpCode(204)
  async rejectUser(
    @Param('id') id: string,
    @Body() { reason }: { reason: string },
  ) {
    await this.userService.rejectUser(+id, reason);
  }

  // ✅ Admin approves removal request
  @Patch('participants/:id/approve-removal')
  approveParticipantRemoval(
    @Param('id') id: number,
    @Body('adminId') adminId: number,
  ) {
    return this.adminService.approveAndRemoveParticipant(+id, +adminId);
  }
// ✅ Admin views all pending participant removal requests
@Get('participant-removal-requests')
getParticipantRemovalRequests() {
  return this.prisma.participation.findMany({
    where: { removalStatus: 'PENDING' },
    include: {
      user: true, // who is being removed
      post: true, // event or formation
      removalRequestedBy: true, // who requested removal
    },
  });
}

  // ✅ Post owner requests removal
  @Patch('participants/:id/request-removal')
  async requestParticipantRemoval(
    @Param('id') id: number,
    @Body() body: { reason: string; userId: number },
  ) {
    const { reason, userId } = body;
    return this.prisma.participation.update({
      where: { id: +id },
      data: {
        removalStatus: 'PENDING',
        removalReason: reason,
        removalRequestedById: userId,
      },
    });
  }

  // ✅ Admin adds participant using identification
  @Post('posts/:postId/participants-by-id')
  async addParticipantByIdentification(
    @Param('postId') postId: number,
    @Body() body: { identification: string; motivation?: string },
  ) {
    return this.adminService.addParticipantByIdentification(
      +postId,
      body.identification,
      body.motivation,
    );
  }
}
