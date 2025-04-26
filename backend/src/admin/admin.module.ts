import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
@Module({
  controllers: [AdminController],
  providers: [UserService, PrismaService],
})
export class AdminModule {}
