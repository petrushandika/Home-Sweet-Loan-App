import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/config/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        isVerified: true,
        avatarUrl: true,
        plan: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateProfile(userId: string, data: { name?: string; avatarUrl?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        isVerified: true,
        avatarUrl: true,
        plan: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
