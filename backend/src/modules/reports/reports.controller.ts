import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
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

  @Get('summary')
  @ApiOperation({ summary: 'Get dashboard summary stats' })
  async getSummary(@CurrentUser() user: any) {
    const summary = await this.reportsService.getSummary(user.id);
    return {
      success: true,
      data: summary,
    };
  }
}
