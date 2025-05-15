/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  ConflictException,
  Inject,
  Injectable,
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

@Injectable()
export class AuthService {
  constructor(
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
  async updateProfile(
    userId: number,
    updateData: {
      firstName: string;
      lastName: string;
      university: string;
      profilePicture?: string;
    },
  ) {
    return this.userService.updateProfile(userId, updateData);
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
    return {
      id: userId,
      email: email,
      firstName: firstName,
      role,
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
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      university: user.university,
      email: user.email,
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

  async signOut(userId: number) {
    return await this.userService.updateHashedRefreshToken(userId, null);
  }
}
