import { Module } from '@nestjs/common';
import { TasksService } from './task.service';
import { TaskController } from './task.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TaskController],
  providers: [TasksService],
})
export class TasksModule {}
