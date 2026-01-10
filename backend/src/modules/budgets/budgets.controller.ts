import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@ApiTags('budgets')
@ApiBearerAuth()
@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all budgets' })
  async findAll(
    @CurrentUser() user: any,
    @Query('year') year?: number,
    @Query('month') month?: number,
  ) {
    const budgets = await this.budgetsService.findAll(user.id, year, month);
    return {
      success: true,
      data: budgets,
    };
  }

  @Get(':yearMonth')
  @ApiOperation({ summary: 'Get specific budget by year-month' })
  async findOne(@CurrentUser() user: any, @Param('yearMonth') yearMonth: string) {
    const budget = await this.budgetsService.findOne(user.id, yearMonth);
    return {
      success: true,
      data: budget,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create new budget' })
  async create(@CurrentUser() user: any, @Body() createBudgetDto: CreateBudgetDto) {
    const budget = await this.budgetsService.create(user.id, createBudgetDto);
    return {
      success: true,
      data: budget,
      message: 'Budget created successfully',
    };
  }

  @Put(':yearMonth')
  @ApiOperation({ summary: 'Update budget' })
  async update(
    @CurrentUser() user: any,
    @Param('yearMonth') yearMonth: string,
    @Body() updateBudgetDto: UpdateBudgetDto,
  ) {
    const budget = await this.budgetsService.update(user.id, yearMonth, updateBudgetDto);
    return {
      success: true,
      data: budget,
      message: 'Budget updated successfully',
    };
  }

  @Delete(':yearMonth')
  @ApiOperation({ summary: 'Delete budget' })
  async remove(@CurrentUser() user: any, @Param('yearMonth') yearMonth: string) {
    await this.budgetsService.remove(user.id, yearMonth);
    return {
      success: true,
      message: 'Budget deleted successfully',
    };
  }
}
