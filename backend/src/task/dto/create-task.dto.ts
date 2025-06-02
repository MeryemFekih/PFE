import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { TaskStatus, Priority } from '@prisma/client'; 



export class CreateTaskDto {
  @IsString()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  
}

export { Priority}; 