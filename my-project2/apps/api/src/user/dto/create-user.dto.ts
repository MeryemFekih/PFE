/* eslint-disable prettier/prettier */
 
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsPhoneNumber()
  @IsOptional()
  phone: string;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  birthdate: Date;

  @IsEnum(['male', 'female'])
  @IsNotEmpty()
  gender: "male" | "female";

  @IsString()
  @IsOptional()
  university?: string;

  @IsString()
  @IsOptional()
  userType?: string;

  @IsString()
  @IsOptional()
  formation?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  graduationYear?: Date;

  @IsString()
  @IsOptional()
  degree?: string;

  @IsString()
  @IsOptional()
  occupation?: string;

  @IsString()
  @IsOptional()
  subject?: string;

  @IsString()
  @IsOptional()
  rank?: string;

  @IsString({ each: true })
  @IsOptional()
  interests?: string[];
}
