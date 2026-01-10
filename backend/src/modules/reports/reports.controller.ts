import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@ApiTags('reports')
@ApiBearerAuth()
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('monthly')
  async getMonthlyReport(
    @CurrentUser() user: any,
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    const report = await this.reportsService.getMonthlyReport(user.id, year, month);
    return {
      success: true,
      data: report,
    };
  }
}
