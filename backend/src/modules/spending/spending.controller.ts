import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SpendingService } from './spending.service';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@ApiTags('spending')
@ApiBearerAuth()
@Controller('spending')
export class SpendingController {
  constructor(private readonly spendingService: SpendingService) {}

  @Get()
  async findAll(@CurrentUser() user: any, @Query() filters: any) {
    const result = await this.spendingService.findAll(user.id, filters);
    return {
      success: true,
      data: result,
    };
  }

  @Post()
  async create(@CurrentUser() user: any, @Body() data: any) {
    const spending = await this.spendingService.create(user.id, data);
    return {
      success: true,
      data: spending,
      message: 'Spending created successfully',
    };
  }

  @Put(':id')
  async update(@CurrentUser() user: any, @Param('id') id: string, @Body() data: any) {
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
