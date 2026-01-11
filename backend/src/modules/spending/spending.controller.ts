import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SpendingService } from './spending.service';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { CreateSpendingDto } from './dto/create-spending.dto';
import { UpdateSpendingDto } from './dto/update-spending.dto';

@ApiTags('spending')
@ApiBearerAuth()
@Controller('spending')
export class SpendingController {
  constructor(private readonly spendingService: SpendingService) {}

  @Get()
  @ApiOperation({ summary: 'Get all spending records' })
  async findAll(@CurrentUser() user: any, @Query() filters: any) {
    const result = await this.spendingService.findAll(user.id, filters);
    return {
      success: true,
      data: result,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new spending record' })
  @ApiResponse({ status: 201, description: 'Spending created successfully' })
  async create(@CurrentUser() user: any, @Body() data: CreateSpendingDto) {
    const spending = await this.spendingService.create(user.id, data);
    return {
      success: true,
      data: spending,
      message: 'Spending created successfully',
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a spending record' })
  @ApiResponse({ status: 200, description: 'Spending updated successfully' })
  async update(@CurrentUser() user: any, @Param('id') id: string, @Body() data: UpdateSpendingDto) {
    const spending = await this.spendingService.update(id, user.id, data);
    return {
      success: true,
      data: spending,
      message: 'Spending updated successfully',
    };
  }

  @Delete(':id')
  async remove(@CurrentUser() user: any, @Param('id') id: string) {
    await this.spendingService.remove(id, user.id);
    return {
      success: true,
      message: 'Spending deleted successfully',
    };
  }
}
