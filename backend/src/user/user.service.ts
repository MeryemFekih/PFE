import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'argon2';
import { Role, Visibility } from '@prisma/client';
import { EventService } from 'src/event/event.service';

@Injectable()
export class UserService {
  async findById(id: number) {
  return this.prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      interests: true,
      university: true,
      formation: true,
      subject: true,
      profilePicture: true,
    },
  });
}


  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => EventService)) // Correctly reference EventService
    private readonly eventService: EventService // Rename to eventService for clarity
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { password, userType,  ...user } = createUserDto;
    console.log(password);
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

async getProfile(userId: number) {
  const user = await this.prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const base = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    profilePicture: user.profilePicture,
    university: user.university,
    interests: user.interests,
  };

  switch (user.role) {
    case 'STUDENT':
      return {
        ...base,
        formation: user.formation,
        graduationYear: user.graduationYear,
        degree: user.degree,
      };
    case 'PROFESSOR':
      return {
        ...base,
        subject: user.subject,
        rank: user.rank,
      };
    case 'ALUMNI':
      return {
        ...base,
        occupation: user.occupation,
        graduationYear: user.graduationYear,
        degree: user.degree,
      };
    default:
      return base;
  }
}

async updateProfile(userId: number, data: Partial<any>) {
  const { id, email, role, status, ...updatableFields } = data;
  return this.prisma.user.update({
    where: { id: userId },
    data: updatableFields,
  });
}
async findUsersWithSharedInterests(currentUserId: number, interests: string[]) {
  return this.prisma.user.findMany({
    where: {
      id: { not: currentUserId },
      interests: {
        hasSome: interests,
      },
    },
    take: 20, // more than 5 in case you want to shuffle later
  });
}


async followUser(currentUserId: number, targetUserId: number) {
  if (currentUserId === targetUserId) {
    throw new Error('You cannot follow yourself');
  }

  return this.prisma.user.update({
    where: { id: currentUserId },
    data: {
      following: {
        connect: { id: targetUserId },
      },
    },
    select: { id: true },
  });
}

async unfollowUser(currentUserId: number, targetUserId: number) {
  if (currentUserId === targetUserId) {
    throw new Error('You cannot unfollow yourself');
  }

  return this.prisma.user.update({
    where: { id: currentUserId },
    data: {
      following: {
        disconnect: { id: targetUserId },
      },
    },
    select: { id: true },
  });
}

async isFollowing(currentUserId: number, targetUserId: number) {
  const result = await this.prisma.user.findFirst({
    where: {
      id: currentUserId,
      following: {
        some: { id: targetUserId },
      },
    },
    select: { id: true },
  });

  return !!result;
}
async getUserWithPosts(targetId: number, viewerId: number, viewerRole: Role) {
  const isPublicViewer = viewerRole === 'PUBLIC';

  const user = await this.prisma.user.findUnique({
    where: { id: targetId },
    include: {
      posts: {
        where: {
          OR: [
            { visibility: Visibility.PUBLIC },
            ...(isPublicViewer ? [] : [{ visibility: Visibility.PRIVATE }]),
          ]
        },
        orderBy: { createdAt: 'desc' },
      },
      followers: {
        where: { id: viewerId },
      },
    },
  });

  if (!user) throw new Error('User not found');

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    profilePicture: user.profilePicture,
    role: user.role,
    university: user.university,
    formation: user.formation,
    subject: user.subject,
    occupation: user.occupation,
    posts: user.posts,
    isFollowing: user.followers.length > 0,
  };
}
async findUsersByIds(ids: number[]) {
    return this.prisma.user.findMany({
      where: {
        id: { in: ids }
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        profilePicture: true, // Optional
        role: true,           // Optional
      }
    });
  }

  async searchUsersByName(query: string) {
  return this.prisma.user.findMany({
    where: {
      OR: [
        { firstName: { contains: query, mode: 'insensitive' } },
        { lastName: { contains: query, mode: 'insensitive' } },
      ],
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      profilePicture: true,
      role: true,
    },
  });
}

// user.service.ts
async getFollowDetails(userId: number) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    include: {
      following: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profilePicture: true,
          role: true,
        },
      },
      followers: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profilePicture: true,
          role: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return {
    followingCount: user.following.length,
    followersCount: user.followers.length,
    following: user.following,
    followers: user.followers,
  };
}}