import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/config/prisma.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AssetsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  async findAll(userId: string) {
    const assets = await this.prisma.asset.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const liquidAssets = assets.filter((a) => a.type === 'LIQUID');
    const nonLiquidAssets = assets.filter((a) => a.type === 'NON_LIQUID');

    const totalLiquid = liquidAssets.reduce((sum, a) => sum + Number(a.value), 0);
    const totalNonLiquid = nonLiquidAssets.reduce((sum, a) => sum + Number(a.value), 0);

    const settings = await this.prisma.userSettings.findUnique({
      where: { userId },
    });

    const target = settings?.assetsTarget || 0;
    const totalAssets = totalLiquid + totalNonLiquid;
    const progress = Number(target) > 0 ? (totalAssets / Number(target)) * 100 : 0;

    return {
      liquidAssets,
      nonLiquidAssets,
      summary: {
        totalLiquidAssets: totalLiquid,
        totalNonLiquidAssets: totalNonLiquid,
        totalAssets,
        target: Number(target),
        progress: Math.round(progress * 100) / 100,
      },
    };
  }

  async create(userId: string, data: CreateAssetDto) {
    const asset = await (this.prisma.asset as any).create({
      data: {
        userId,
        ...data,
      },
    });

    // Log Activity
    await this.notifications.create(
      userId,
      'Asset Registered',
      `Registered a new asset: ${data.description}`,
      'ASSET',
      { assetId: asset.id, value: data.value, type: data.type },
    );

    return asset;
  }

  async update(id: string, userId: string, data: UpdateAssetDto) {
    const asset = await (this.prisma.asset as any).update({
      where: { id, userId },
      data,
    });

    // Log Activity
    await this.notifications.create(
      userId,
      'Asset Updated',
      `Updated asset details: ${asset.description}`,
      'ASSET',
      { assetId: asset.id, value: asset.value, type: asset.type },
    );

    return asset;
  }

  async remove(id: string, userId: string) {
    return this.prisma.asset.delete({
      where: { id, userId },
    });
  }

  async updateTarget(userId: string, target: number) {
    return this.prisma.userSettings.upsert({
      where: { userId },
      update: { assetsTarget: target },
      create: { userId, assetsTarget: target },
    });
  }
}
