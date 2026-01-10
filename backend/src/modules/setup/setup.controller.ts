import { Controller, Get, Put, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SetupService } from './setup.service';
import { UpdateSetupDto } from './dto/update-setup.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@ApiTags('setup')
@ApiBearerAuth()
@Controller('setup')
export class SetupController {
  constructor(private readonly setupService: SetupService) {}

  @Get()
  @ApiOperation({ summary: 'Get user setup configuration' })
  async getSetup(@CurrentUser() user: any) {
    const setup = await this.setupService.getSetup(user.id);
    return {
      success: true,
      data: setup,
    };
  }

  @Put()
  @ApiOperation({ summary: 'Update setup configuration' })
  async updateSetup(
    @CurrentUser() user: any,
    @Body() updateSetupDto: UpdateSetupDto,
  ) {
    const setup = await this.setupService.updateSetup(user.id, updateSetupDto);
    return {
      success: true,
      data: setup,
      message: 'Setup updated successfully',
    };
  }
}
