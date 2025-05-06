// src/post/dto/create-post.dto.ts
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  mediaUrl?: string;
}
