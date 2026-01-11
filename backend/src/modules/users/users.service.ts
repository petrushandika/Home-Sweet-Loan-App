import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/config/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async updateAvatar(userId: string, file: Express.Multer.File) {
    try {
      const result = await this.cloudinary.uploadFile(file);
      
      if ('url' in result) {
        return this.prisma.user.update({
          where: { id: userId },
          data: { avatarUrl: result.secure_url || result.url },
          select: {
            id: true,
            avatarUrl: true,
          },
        });
      }
      
      throw new BadRequestException('Upload to Cloudinary failed');
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to upload profile picture');
    }
  }

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
