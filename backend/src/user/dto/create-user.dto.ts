/* eslint-disable prettier/prettier */
import {
  IsArray,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Role, UserStatus } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName!: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(320)
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  password!: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  userType?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  profilePicture?: string;

  @IsString()
  @IsOptional()
  @MaxLength(25)
  phone?: string;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  birthdate!: Date;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  gender!: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  university?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  formation?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  degree?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  graduationYear?: Date;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  occupation?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  subject?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  rank?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @MaxLength(100, { each: true })
  interests?: string[];

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;
}