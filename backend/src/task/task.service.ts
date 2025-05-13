import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto,  } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Priority, TaskStatus } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  // Removed duplicate removeById method
  
  findByUser(userId: number) {
    return this.prisma.task.findMany({
      where: { userId, },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Create a task
  async create(userId: number, createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        id: uuidv4(),
        user: { connect: { id: userId } },
        title: createTaskDto.title,
        description: createTaskDto.description || null,
        priority: createTaskDto.priority || Priority.MEDIUM, 
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
  async update(id: string, data: UpdateTaskDto) {
  console.log('Updating with:', data);
  console.log(`Updating task ${id} with data:`, data);

  return this.prisma.task.update({
    where: { id },
    data: {
       ...(data.title !== undefined ? { title: data.title }: {}),
      ...(data.description !== undefined ? { description: data.description }: {}),
      ...(data.priority !== undefined ? { priority: data.priority }: {}),
      ...(data.status !== undefined ? { status: data.status }: {}),
    },
  });
}
  async updateStatus(id: string, status: TaskStatus) {
  console.log(`Updating status for task ${id} to ${status}`);

    return this.prisma.task.update({
      where: { id },
      data: { status },
    });
  }// Removed duplicate removeById method
  
  // Remove a task
  async removeById(id: string) {
    console.log(`Deleting task ${id}`);

    return this.prisma.task.delete({
      where: { id },
    });
  }
  
}
