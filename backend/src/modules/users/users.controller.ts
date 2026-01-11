import { Controller, Get, Put, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    const profile = await this.usersService.getProfile(user.id);
    return {
      success: true,
      data: profile,
    };
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update current user profile' })
  async updateProfile(@CurrentUser() user: any, @Body() data: { name?: string; avatarUrl?: string; phoneNumber?: string; birthDate?: string | Date; gender?: string }) {
    const profile = await this.usersService.updateProfile(user.id, data);
    return {
      success: true,
      data: profile,
      message: 'Profile updated successfully',
    };
  }

  @Get('settings')
  @ApiOperation({ summary: 'Get current user settings' })
  async getSettings(@CurrentUser() user: any) {
    const settings = await this.usersService.getSettings(user.id);
    return {
      success: true,
      data: settings,
    };
  }

  @Put('settings')
  @ApiOperation({ summary: 'Update current user settings' })
  async updateSettings(@CurrentUser() user: any, @Body() data: any) {
    const settings = await this.usersService.updateSettings(user.id, data);
    return {
      success: true,
      data: settings,
      message: 'Settings updated successfully',
    };
  }
}
