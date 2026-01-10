import { Controller, Get, Put, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
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
  async updateProfile(@CurrentUser() user: any, @Body() data: { name?: string }) {
    const profile = await this.usersService.updateProfile(user.id, data);
    return {
      success: true,
      data: profile,
      message: 'Profile updated successfully',
    };
  }
}
