import { Module } from '@nestjs/common';
import { TasksService } from './task.service';
import { TaskController } from './task.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
@Module({
  imports: [PrismaModule],
  controllers: [TaskController],
  providers: [TasksService, PrismaService],
})
export class TasksModule {}
