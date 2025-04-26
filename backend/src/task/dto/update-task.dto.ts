import { TaskStatus, Priority } from '@prisma/client';

export class UpdateTaskDto {
  title?: string;
  description?: string;
  dueDate?: string;
  status?: TaskStatus;  // This needs to be of type Status enum, not string
  priority?: Priority;
}