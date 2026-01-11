import { Controller, Get, Put, Post, Body, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload profile picture' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadAvatar(
    @CurrentUser() user: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5242880 }), // 5MB
          new FileTypeValidator({ fileType: 'image/(jpeg|png|webp)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const result = await this.usersService.updateAvatar(user.id, file);
    return {
      success: true,
      data: result,
      message: 'Avatar uploaded successfully',
    };
  }

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
