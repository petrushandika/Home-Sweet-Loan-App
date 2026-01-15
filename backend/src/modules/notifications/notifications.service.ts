import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '@/config/prisma.service';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async findAll(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  async markAsRead(userId: string, id: string) {
    return this.prisma.notification.update({
      where: { id, userId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async create(
    userId: string,
    title: string,
    message: string,
    type:
      | 'INFO'
      | 'SUCCESS'
      | 'WARNING'
      | 'ERROR'
      | 'PAYMENT'
      | 'SYSTEM'
      | 'BUDGET'
      | 'ASSET' = 'INFO',
    metadata: any = {},
  ) {
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        metadata,
      },
    });

    // Broadcast via socket
    this.notificationsGateway.sendToUser(userId, notification);

    return notification;
  }
}
