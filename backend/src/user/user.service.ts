import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'argon2';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...user } = createUserDto;
    const hashedPassword = await hash(password);
    return await this.prisma.user.create({
      data: {
        password: hashedPassword,
        role: 'PENDING',
        status: 'PENDING_APPROVAL',
        ...user,
      },
    });
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findOne(userId: number) {
    return await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async updateHashedRefreshToken(userId: number, hashedRT: string | null) {
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRefreshToken: hashedRT,
      },
    });
  }
  async findPending() {
    return this.prisma.user.findMany({
      where: { status: 'PENDING_APPROVAL' },
    });
  }

  async approveUser(id: number) {
    // 1. First get the user to check their userType
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { userType: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // 2. Map userType to Role
    const roleMap = {
      student: 'STUDENT',
      alumni: 'ALUMNI',
      professor: 'PROFESSOR',
    };

    const role = roleMap[user.userType as string] as Role;

    if (!role) {
      throw new Error('Invalid userType');
    }

    // 3. Update with the mapped role
    return this.prisma.user.update({
      where: { id },
      data: {
        role,
        status: 'ACTIVE',
        approvedAt: new Date(),
      },
    });
  }
  async rejectUser(id: number, reason: string) {
    return this.prisma.user.update({
      where: { id },
      data: {
        role: 'PENDING',
        status: 'REJECTED',
        rejectionReason: reason,
        rejectedAt: new Date(),
      },
    });
  }
}
