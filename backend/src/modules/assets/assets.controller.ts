import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AssetsService } from './assets.service';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@ApiTags('assets')
@ApiBearerAuth()
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  async findAll(@CurrentUser() user: any) {
    const result = await this.assetsService.findAll(user.id);
    return {
      success: true,
      data: result,
    };
  }

  @Post()
  async create(@CurrentUser() user: any, @Body() data: any) {
    const asset = await this.assetsService.create(user.id, data);
    return {
      success: true,
      data: asset,
      message: 'Asset created successfully',
    };
  }

  @Put('target')
  async updateTarget(@CurrentUser() user: any, @Body() data: { target: number }) {
    const settings = await this.assetsService.updateTarget(user.id, data.target);
    return {
      success: true,
      data: settings,
      message: 'Target updated successfully',
    };
  }

  @Put(':id')
  async update(@CurrentUser() user: any, @Param('id') id: string, @Body() data: any) {
    const asset = await this.assetsService.update(id, user.id, data);
    return {
      success: true,
      data: asset,
      message: 'Asset updated successfully',
    };
  }

  @Delete(':id')
  async remove(@CurrentUser() user: any, @Param('id') id: string) {
    await this.assetsService.remove(id, user.id);
    return {
      success: true,
      message: 'Asset deleted successfully',
    };
  }
}
