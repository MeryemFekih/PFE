import { Controller, Get, Patch, Param, Body, HttpCode } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserService } from 'src/user/user.service';

// admin.controller.ts
@Controller('admin')
@Roles('ADMIN')
export class AdminController {
  constructor(private userService: UserService) {}

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
}
