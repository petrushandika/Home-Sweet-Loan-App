import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { ResponseMessage } from '@/common/decorators/response-message.decorator';

@ApiTags('budgets')
@ApiBearerAuth()
@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Get()
  @ResponseMessage('Budgets retrieved successfully')
  async findAll(
    @CurrentUser() user: any,
    @Query('year') year?: number,
    @Query('month') month?: number,
  ) {
    return this.budgetsService.findAll(user.id, year, month);
  }

  @Get(':yearMonth')
  @ApiOperation({ summary: 'Get specific budget by year-month' })
  @ResponseMessage('Budget retrieved successfully')
  async findOne(@CurrentUser() user: any, @Param('yearMonth') yearMonth: string) {
    return this.budgetsService.findOne(user.id, yearMonth);
  }

  @Post()
  @ApiOperation({ summary: 'Create new budget' })
  @ResponseMessage('Budget created successfully')
  async create(@CurrentUser() user: any, @Body() createBudgetDto: CreateBudgetDto) {
    return this.budgetsService.create(user.id, createBudgetDto);
  }

  @Put(':yearMonth')
  @ApiOperation({ summary: 'Update budget' })
  @ResponseMessage('Budget updated successfully')
  async update(
    @CurrentUser() user: any,
    @Param('yearMonth') yearMonth: string,
    @Body() updateBudgetDto: UpdateBudgetDto,
  ) {
    return this.budgetsService.update(user.id, yearMonth, updateBudgetDto);
  }

  @Delete(':yearMonth')
  @ApiOperation({ summary: 'Delete budget' })
  @ResponseMessage('Budget deleted successfully')
  async remove(@CurrentUser() user: any, @Param('yearMonth') yearMonth: string) {
    await this.budgetsService.remove(user.id, yearMonth);
    return null;
  }
}
