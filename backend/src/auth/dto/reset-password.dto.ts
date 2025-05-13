import { IsEmail, IsString, Length } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  email!: string;

  @IsString()
  resetCode!: string;

  @Length(6, 100)
  newPassword!: string;
}