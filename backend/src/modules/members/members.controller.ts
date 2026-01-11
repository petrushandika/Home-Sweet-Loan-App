import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MembersService } from './members.service';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { InviteMemberDto } from './dto/invite-member.dto';

@ApiTags('members')
@ApiBearerAuth()
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user members' })
  async getMembers(@CurrentUser() user: any) {
    const result = await this.membersService.getMembers(user.id);
    return {
      success: true,
      data: result,
    };
  }

  @Post('invite')
  @ApiOperation({ summary: 'Invite a member' })
  async inviteMember(
    @CurrentUser() user: any, 
    @Body() body: InviteMemberDto
  ) {
    const result = await this.membersService.inviteMember(user.id, body);
    return {
      success: true,
      data: result,
      message: 'Invitation sent successfully',
    };
  }

  @Delete(':memberId')
  @ApiOperation({ summary: 'Remove a member' })
  async removeMember(@CurrentUser() user: any, @Param('memberId') memberId: string) {
    await this.membersService.removeMember(user.id, memberId);
    return {
      success: true,
      message: 'Member removed successfully',
    };
  }
}
