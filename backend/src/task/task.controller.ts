import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { TasksService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskStatus } from '@prisma/client';

@Controller('tasks')
export class TaskController {
  constructor(private readonly tasksService: TasksService) {}

  // CREATE
  @Post(':userId')
  async create(
    @Param('userId') userId: number,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.create(userId, createTaskDto);
  }

  // GET TASKS BY USER
  @Get(':userId')
  async findByUser(@Param('userId') userId: string) {
    console.log('Received GET /tasks/:userId request with ID:', userId);
    return this.tasksService.findByUser(+userId);
  }

  // GET ONE TASK BY USER
  @Get(':userId/task/:id')
  async getTask(
    @Param('userId') userId: number,
    @Param('id') id: string,
  ): Promise<Task | null> {
    const task = await this.tasksService.findOne(userId, id);
    if (!task) {
      throw new BadRequestException('Task not found');
    }
    return task;
  }

  // ✅ PATCH TASK STATUS ONLY
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    const upperStatus = body.status.toUpperCase();
    const validStatuses = ['TODO', 'IN_PROGRESS', 'COMPLETED'];

    if (!validStatuses.includes(upperStatus)) {
      throw new BadRequestException('Invalid task status');
    }

    console.log('Received PATCH for status with body:', body);
    return this.tasksService.updateStatus(id, upperStatus as TaskStatus);
  }

  // ✅ FULL TASK UPDATE
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, updateTaskDto);
  }

  // DELETE TASK
  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    return this.tasksService.removeById(id);
  }
}
