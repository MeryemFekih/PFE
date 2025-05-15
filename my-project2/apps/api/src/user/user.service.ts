import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'argon2';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { password, userType, ...user } = createUserDto;
    const hashedPassword = await hash(password);

    let role: Role = 'PUBLIC';
    let status: 'ACTIVE' | 'SUSPENDED' | 'PENDING_APPROVAL' = 'SUSPENDED';

    if (
      userType === 'student' ||
      userType === 'alumni' ||
      userType === 'professor'
    ) {
      role = 'PUBLIC';
      status = 'PENDING_APPROVAL';
    }

    return this.prisma.user.create({
      data: {
        ...user,
        userType,
        password: hashedPassword,
        role,
        status,
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
        role: 'PUBLIC',
        status: 'REJECTED',
        rejectionReason: reason,
        rejectedAt: new Date(),
      },
    });
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
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: updateData.firstName,
        lastName: updateData.lastName,
        university: updateData.university,
        ...(updateData.profilePicture && {
          profilePicture: updateData.profilePicture,
        }),
      },
    });
  }
}
