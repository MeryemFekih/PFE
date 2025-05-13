// src/post/dto/create-post.dto.ts
import { IsOptional, IsString, IsNotEmpty, IsEnum } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsEnum(['PUBLIC', 'PRIVATE'])
  visibility: 'PUBLIC' | 'PRIVATE';

  @IsOptional()
  @IsString()
  mediaUrl?: string;
}
