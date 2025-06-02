import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { hash, verify } from 'argon2';
import type { AuthJwtPayload } from './types/jwt-payloads';
import { JwtService } from '@nestjs/jwt';
import refreshConfig from './config/refresh.config';
import { ConfigType } from '@nestjs/config';
import { Role } from '@prisma/client';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
  ) {}
  async registerUser(createUserDto: CreateUserDto) {
    const user = await this.userService.findByEmail(createUserDto.email);
    if (user) throw new ConflictException('User already exists!');
    return this.userService.create(createUserDto);
  }

  async validateLocalUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found!');
    }

    try {
      // Properly await the verification
      const isPasswordMatched = await verify(user.password, password);

      console.log(`Password verification result: ${isPasswordMatched}`);
      console.log(`Input password: ${password}`);
      console.log(`Stored hash: ${user.password}`);

      const isMatch = await verify(user.password, password);
      console.log('Verification result:', isMatch);

      if (!isMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        role: user.role,
      };
    } catch (error) {
      console.error('Password verification error:', error);
      throw new UnauthorizedException('Authentication failed');
    }
  }

  async login(userId: number, email: string, firstName: string, role: Role) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRT = await hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId, hashedRT);
    const user = await this.userService.findById(userId); // include interests, etc.
    console.log('✅ FULL USER:', user);

    return {
      id: user?.id ?? userId,
      email: user?.email ?? email,
      firstName: user?.firstName ?? firstName,
      lastName: user?.lastName ?? null,
      role: user?.role ?? role,
      interests: user?.interests ?? [],
      university: user?.university ?? null,
      formation: user?.formation ?? null,
      subject: user?.subject ?? null,
      profilePicture: user?.profilePicture ?? null,
      accessToken,
      refreshToken,
    };
  }

  async generateTokens(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateJwtUser(userId: number) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new UnauthorizedException('User not found!');
    const currentUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      university: user.university,
      formation: user.formation,
      identification: user.identification,
      graduationYear: user.graduationYear,
      degree: user.degree,
      occupation: user.occupation,
      subject: user.subject,
      rank: user.rank,
      interests: user.interests,
      role: user.role,
      profilePicture: user.profilePicture,
    };
    return currentUser;
  }

  async validateRefreshToken(userId: number, refreshToken: string) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new UnauthorizedException('User not found!');

    const refreshTokenMatched = await verify(
      user.hashedRefreshToken as string,
      refreshToken,
    );

    if (!refreshTokenMatched)
      throw new UnauthorizedException('Invalid Refresh Token!');
    const currentUser = { id: user.id };
    return currentUser;
  }

  async refreshToken(userId: number, email: string) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRT = await hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId, hashedRT);
    return {
      id: userId,
      email: email,
      accessToken,
      refreshToken,
    };
  }
  async forgotPassword(email: string) {
      console.log('📩 Forgot password hit with:', email);

      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) throw new NotFoundException('User not found');

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = new Date(Date.now() + 15 * 60 * 1000);

      await this.prisma.user.update({
      where: { id: user.id },
      data: { resetCode: code, resetCodeExpiry: expiry },
      });
      console.log('MAIL_USER:', process.env.MAIL_USER);

      const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
      },
      });

      await transporter.verify().then(() => {
      console.log('✅ Gmail transporter is ready to send emails');
      }).catch(err => {
      console.error('❌ Transporter verification error:', err);
      });

      try {
      await transporter.sendMail({
      from: `No Reply <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Your Password Reset Code',
      html: `<p>Your reset code is: <strong>${code}</strong></p>`
      });
      console.log(`✅ Email sent to: ${email}`);
      } catch (err) {
      console.error('❌ Failed to send email:', err);
      }

      return { message: 'Reset code sent to email' };
      }

      async resetPassword({ email, resetCode, newPassword }: ResetPasswordDto) {
      console.log('🔐 Step 3: Submitting new password for:', email, newPassword);

      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
      console.warn('❌ User not found');
      throw new BadRequestException('User not found');
      }

      if (
      user.resetCode !== resetCode ||
      !user.resetCodeExpiry ||
      user.resetCodeExpiry < new Date()
      ) {
      console.warn('❌ Invalid or expired reset code');
      throw new BadRequestException('Invalid or expired reset code');
      }

      if (newPassword === 'TEMP__') {
      console.log('✅ Code verified only — no password reset');
      return { message: 'Code verified' };
      }

      try {
      const hashed = await hash(newPassword);
      await this.prisma.user.update({
      where: { id: user.id },
      data: {
      password: hashed,
      resetCode: null,
      resetCodeExpiry: null,
      },
      });
      console.log('✅ Password reset successfully');
      return { message: 'Password reset successfully' };
      } catch (err) {
      console.error('🔥 Prisma update error:', err);
      throw new BadRequestException('Failed to reset password');
      }
      }

  async signOut(userId: number) {
    return await this.userService.updateHashedRefreshToken(userId, null);
  }
}