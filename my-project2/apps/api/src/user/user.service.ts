import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { hash } from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<Prisma.UserGetPayload<{}>> {
    const { password, birthdate, graduationYear, interests, ...userData } = createUserDto;
    const hashedPassword = await hash(password);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        birthdate: new Date(birthdate),
        graduationYear: graduationYear ? new Date(graduationYear) : null,
        interests: interests || [], // Field name must match schema
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}