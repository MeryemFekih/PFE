import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto,  } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Priority, TaskStatus } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a task
  async create(userId: number, createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        id: uuidv4(),
        user: { connect: { id: userId } },
        title: createTaskDto.title,
        description: createTaskDto.description || null,
        dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null,
        priority: createTaskDto.priority || Priority.MEDIUM, // Provide default
        status: createTaskDto.status || TaskStatus.TODO,
      },
    });
  }

  // Get all tasks for a user
  async findAll(userId: number) {
    return this.prisma.task.findMany({
      where: { userId: userId },  // Get tasks based on userId
    });
  }

  // Get a single task by userId and taskId
  async findOne(userId: number, id: string) {
    return this.prisma.task.findFirst({
      where: { id, userId },  // Ensure the task belongs to the specified user
    });
  }

  // Update task
  async update(userId: number, id: string, updateTaskDto: UpdateTaskDto) {
    return this.prisma.task.update({
      where: { id },
      data: {
        title: updateTaskDto.title,
        description: updateTaskDto.description || null,  // Make description optional
        dueDate: updateTaskDto.dueDate ? new Date(updateTaskDto.dueDate) : null,  // Convert dueDate to Date if provided
        status: updateTaskDto.status || TaskStatus.TODO,  // Default to TaskStatus.TODO if status is not provided
      },
    });
  }

  // Remove a task
  async remove(userId: number, id: string) {
    return this.prisma.task.delete({
      where: { id },
    });
  }
}
