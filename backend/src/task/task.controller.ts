import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { TasksService } from './task.service'; 
import { CreateTaskDto } from './dto/create-task.dto'; 
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, Priority, TaskStatus } from '@prisma/client';@Controller('tasks')
export class TaskController {
  constructor(private readonly tasksService: TasksService) { }

  @Post(':userId')
  async create(@Param('userId') userId: number, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(userId, createTaskDto);  // Passing userId to service
  }

  @Get(':userId')
  async getTasks(@Param('userId') userId: number): Promise<Task[]> {
    return this.tasksService.findAll(userId); 
  }

  @Get(':userId/task/:id')
  async getTask(@Param('userId') userId: number, @Param('id') id: string): Promise<Task> {
    return this.tasksService.findOne(userId, id); 
  }

  @Put(':userId/:id')
  async update(@Param('userId') userId: number, @Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(userId, id, updateTaskDto); 
  }

  @Delete(':userId/:id')
  async delete(@Param('userId') userId: number, @Param('id') id: string) {
    return this.tasksService.remove(userId, id); 
  }
}
