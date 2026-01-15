import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SpendingService } from './spending.service';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { CreateSpendingDto } from './dto/create-spending.dto';
import { UpdateSpendingDto } from './dto/update-spending.dto';
import { ResponseMessage } from '@/common/decorators/response-message.decorator';

@ApiTags('spending')
@ApiBearerAuth()
@Controller('spending')
export class SpendingController {
  constructor(private readonly spendingService: SpendingService) {}

  @Get()
  @ApiOperation({ summary: 'Get all spending records' })
  @ApiResponse({ status: 200, description: 'Return all spending records' })
  @ResponseMessage('Spending records retrieved successfully')
  async findAll(@CurrentUser() user: any, @Query() filters: any) {
    return this.spendingService.findAll(user.id, filters);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new spending record' })
  @ApiResponse({ status: 201, description: 'Spending created successfully' })
  @ResponseMessage('Spending created successfully')
  async create(@CurrentUser() user: any, @Body() data: CreateSpendingDto) {
    return this.spendingService.create(user.id, data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a spending record' })
  @ApiResponse({ status: 200, description: 'Spending updated successfully' })
  @ResponseMessage('Spending updated successfully')
  async update(@CurrentUser() user: any, @Param('id') id: string, @Body() data: UpdateSpendingDto) {
    return this.spendingService.update(id, user.id, data);
  }

  @Delete(':id')
  @ResponseMessage('Spending deleted successfully')
  async remove(@CurrentUser() user: any, @Param('id') id: string) {
    await this.spendingService.remove(id, user.id);
    return null;
  }
}
