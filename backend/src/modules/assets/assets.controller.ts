import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

@ApiTags('assets')
@ApiBearerAuth()
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all assets' })
  async findAll(@CurrentUser() user: any) {
    const result = await this.assetsService.findAll(user.id);
    return {
      success: true,
      data: result,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new asset' })
  @ApiResponse({ status: 201, description: 'Asset created successfully' })
  async create(@CurrentUser() user: any, @Body() data: CreateAssetDto) {
    const asset = await this.assetsService.create(user.id, data);
    return {
      success: true,
      data: asset,
      message: 'Asset created successfully',
    };
  }

  @Put('target')
  @ApiOperation({ summary: 'Update assets target' })
  async updateTarget(@CurrentUser() user: any, @Body() data: { target: number }) {
    const settings = await this.assetsService.updateTarget(user.id, data.target);
    return {
      success: true,
      data: settings,
      message: 'Target updated successfully',
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an asset' })
  @ApiResponse({ status: 200, description: 'Asset updated successfully' })
  async update(@CurrentUser() user: any, @Param('id') id: string, @Body() data: UpdateAssetDto) {
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
