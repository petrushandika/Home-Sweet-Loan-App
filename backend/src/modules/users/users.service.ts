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
        phoneNumber: true,
        birthDate: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateProfile(userId: string, data: { name?: string; avatarUrl?: string; phoneNumber?: string; birthDate?: string | Date; gender?: string }) {
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
        phoneNumber: true,
        birthDate: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getSettings(userId: string) {
    let settings = await this.prisma.userSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      settings = await this.prisma.userSettings.create({
        data: { userId },
      });
    }

    return settings;
  }

  async updateSettings(userId: string, data: { 
    assetsTarget?: number; 
    currency?: string; 
    language?: string; 
    theme?: string;
    emailNotif?: boolean;
    pushNotif?: boolean;
    marketingNotif?: boolean;
    twoFactorEnabled?: boolean;
  }) {
    return this.prisma.userSettings.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data as any },
    });
  }
}
