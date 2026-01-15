import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/config/prisma.service';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly midtransServerKey: string;
  private readonly midtransClientKey: string;
  private readonly midtransApiUrl: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.midtransServerKey = this.configService.get<string>('MIDTRANS_SERVER_KEY');
    this.midtransClientKey = this.configService.get<string>('MIDTRANS_CLIENT_KEY');
    this.midtransApiUrl =
      this.configService.get<string>('MIDTRANS_IS_PRODUCTION') === 'true'
        ? 'https://app.midtrans.com/snap/v1/transactions'
        : 'https://app.sandbox.midtrans.com/snap/v1/transactions';
  }

  async createTransaction(user: User, plan: string, amount: number) {
    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Save pending payment to DB
    const payment = await this.prisma.payment.create({
      data: {
        userId: user.id,
        orderId,
        amount: amount,
        paymentMethod: 'MIDTRANS',
        status: 'PENDING',
        metadata: { plan },
      },
    });

    // Create Snap Token transaction
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: user.name.split(' ')[0],
        last_name: user.name.split(' ').slice(1).join(' ') || '',
        email: user.email,
      },
    };

    try {
      const authString = Buffer.from(this.midtransServerKey + ':').toString('base64');
      const response = await fetch(this.midtransApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${authString}`,
        },
        body: JSON.stringify(parameter),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(JSON.stringify(data));
      }

      // Update payment with token and redirect URL
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          midtransToken: data.token,
          midtransUrl: data.redirect_url,
        },
      });

      return {
        token: data.token,
        redirect_url: data.redirect_url,
        orderId,
      };
    } catch (error) {
      this.logger.error(`Failed to create Midtrans transaction: ${error.message}`);
      throw error;
    }
  }

  async checkTransactionStatus(orderId: string) {
    try {
      const authString = Buffer.from(this.midtransServerKey + ':').toString('base64');
      const baseUrl = this.midtransApiUrl.replace('/snap/v1/transactions', '/v2');
      const url = `${baseUrl}/${orderId}/status`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${authString}`,
          Accept: 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // If 404, maybe order not found.
        this.logger.warn(`Failed to check Midtrans status for ${orderId}: ${JSON.stringify(data)}`);
        return null;
      }

      // Reuse handleNotification logic to update system state
      await this.handleNotification(data);

      return data;
    } catch (error) {
      this.logger.error(`Error checking Midtrans status: ${error.message}`);
      throw error;
    }
  }

  async handleNotification(notificationData: any) {
    const { order_id, transaction_status, fraud_status } = notificationData;

    const payment = await this.prisma.payment.findUnique({
      where: { orderId: order_id },
    });

    if (!payment) return;

    let newStatus: 'PENDING' | 'SUCCESS' | 'FAILED' | 'EXPIRED' | 'CANCELLED' = 'PENDING';

    if (transaction_status == 'capture') {
      if (fraud_status == 'challenge') {
        newStatus = 'PENDING'; // Challenged
      } else if (fraud_status == 'accept') {
        newStatus = 'SUCCESS';
      }
    } else if (transaction_status == 'settlement') {
      newStatus = 'SUCCESS';
    } else if (
      transaction_status == 'cancel' ||
      transaction_status == 'deny' ||
      transaction_status == 'expire'
    ) {
      newStatus = 'FAILED';
    } else if (transaction_status == 'pending') {
      newStatus = 'PENDING';
    }

    // Only update if status changes or we want to force re-activation
    // Ideally we assume handleNotification is idempotent enough

    if (newStatus === 'SUCCESS' && payment.status !== 'SUCCESS') {
      // Activate Subscription
      await this.activateSubscription(payment.userId, (payment.metadata as any).plan);
    }

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: newStatus, paidAt: newStatus === 'SUCCESS' ? new Date() : null },
    });

    return { status: 'ok' };
  }

  private async activateSubscription(userId: string, planName: string) {
    const startDate = new Date();
    const endDate = new Date();

    // Determine duration based on plan? Assuming monthly for now.
    // Ideally store duration in Payment metadata or Plan config.
    endDate.setMonth(endDate.getMonth() + 1);

    const normalizedPlan = planName.toUpperCase() === 'FAMILY' ? 'MEMBERS' : planName.toUpperCase();

    // Deactivate old active subscriptions
    await this.prisma.subscription.updateMany({
      where: { userId, status: 'ACTIVE' },
      data: { status: 'EXPIRED', endDate: new Date() },
    });

    await this.prisma.subscription.create({
      data: {
        userId,
        plan: normalizedPlan as any, // FREE, BASIC, MEMBERS
        status: 'ACTIVE',
        startDate,
        endDate,
      },
    });

    // Update user plan in User table for quick access
    await this.prisma.user.update({
      where: { id: userId },
      data: { plan: normalizedPlan },
    });
  }
}
