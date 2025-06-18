import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async approveAndRemoveParticipant(participationId: number, adminId: number) {
    const participation = await this.prisma.participation.findUnique({
      where: { id: participationId },
    });

    if (!participation) throw new NotFoundException('Participation not found');

    return this.prisma.participation.update({
      where: { id: participationId },
      data: {
        removalStatus: 'APPROVED',
        reviewedById: adminId,
        reviewedAt: new Date(),
      },
    });
  }

  async addParticipantByIdentification(postId: number, identification: string, motivation?: string) {
    const user = await this.prisma.user.findFirst({
      where: { identification },
    });

    if (!user) throw new NotFoundException('User with this ID not found');

    const exists = await this.prisma.participation.findFirst({
      where: { postId, userId: user.id },
    });

    if (exists) {
      throw new BadRequestException('User already a participant of this post');
    }

    return this.prisma.participation.create({
      data: {
        postId,
        userId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        motivation: motivation || null,
      },
    });
  }
}
