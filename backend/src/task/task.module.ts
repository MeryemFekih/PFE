import { Module } from '@nestjs/common';
import { TasksService } from './task.service';
import { TaskController } from './task.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  controllers: [TaskController],
  providers: [TasksService, PrismaService],
})
export class TasksModule {}
