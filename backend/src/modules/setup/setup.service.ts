import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/config/prisma.service';
import { UpdateSetupDto } from './dto/update-setup.dto';

@Injectable()
export class SetupService {
  constructor(private prisma: PrismaService) {}

  async getSetup(userId: string) {
    const setup = await this.prisma.setupConfig.findUnique({
      where: { userId },
    });

    if (!setup) {
      // Create default setup if not exists
      return this.createDefaultSetup(userId);
    }

    return setup;
  }

  async updateSetup(userId: string, updateSetupDto: UpdateSetupDto) {
    const setup = await this.prisma.setupConfig.upsert({
      where: { userId },
      update: updateSetupDto,
      create: {
        userId,
        ...updateSetupDto,
      },
    });

    return setup;
  }

  private async createDefaultSetup(userId: string) {
    return this.prisma.setupConfig.create({
      data: {
        userId,
        accountSummary: [],
        incomeSources: [],
        needs: [],
        wants: [],
        savings: [],
        accountAssets: [],
        paydayDate: 1,
      },
    });
  }
}
