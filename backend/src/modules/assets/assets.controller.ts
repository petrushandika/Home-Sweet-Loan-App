import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { ResponseMessage } from '@/common/decorators/response-message.decorator';

@ApiTags('assets')
@ApiBearerAuth()
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  @ResponseMessage('Assets retrieved successfully')
  async findAll(@CurrentUser() user: any) {
    return this.assetsService.findAll(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new asset' })
  @ApiResponse({ status: 201, description: 'Asset created successfully' })
  @ResponseMessage('Asset created successfully')
  async create(@CurrentUser() user: any, @Body() data: CreateAssetDto) {
    return this.assetsService.create(user.id, data);
  }

  @Put('target')
  @ApiOperation({ summary: 'Update assets target' })
  @ResponseMessage('Target updated successfully')
  async updateTarget(@CurrentUser() user: any, @Body() data: { target: number }) {
    return this.assetsService.updateTarget(user.id, data.target);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an asset' })
  @ApiResponse({ status: 200, description: 'Asset updated successfully' })
  @ResponseMessage('Asset updated successfully')
  async update(@CurrentUser() user: any, @Param('id') id: string, @Body() data: UpdateAssetDto) {
    return this.assetsService.update(id, user.id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an asset' })
  @ResponseMessage('Asset deleted successfully')
  async remove(@CurrentUser() user: any, @Param('id') id: string) {
    await this.assetsService.remove(id, user.id);
    return null;
  }
}
