import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventModule } from 'src/event/event.module';

@Module({
  imports: [EventModule],
  controllers: [AdminController],
  providers: [UserService, PrismaService],
  
})
export class AdminModule {}
