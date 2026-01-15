import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ResponseMessage } from '@/common/decorators/response-message.decorator';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initiate a new payment' })
  @ResponseMessage('Payment initiated successfully')
  async initiatePayment(@CurrentUser() user: User, @Body() body: { plan: string; amount: number }) {
    return this.paymentsService.createTransaction(user, body.plan, body.amount);
  }

  @Post('check-status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Manual check of transaction status' })
  @ResponseMessage('Transaction status checked')
  async checkStatus(@Body() body: { orderId: string }) {
    return this.paymentsService.checkTransactionStatus(body.orderId);
  }

  @Post('notification')
  @ApiOperation({ summary: 'Handle Midtrans payment notifications' })
  @ResponseMessage('Notification processed successfully')
  async handleNotification(@Body() notificationData: any) {
    return this.paymentsService.handleNotification(notificationData);
  }
}
