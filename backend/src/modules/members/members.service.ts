import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/config/prisma.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { MemberRole } from '@prisma/client';
import { InviteMemberDto } from './dto/invite-member.dto';

@Injectable()
export class MembersService {
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async getMembers(userId: string) {
    // Check if user belongs to a group
    const membership = await this.prisma.member.findFirst({
        where: { userId },
        include: { group: { include: { members: { include: { user: true } } } } }
    });

    if (!membership) {
        return [];
    }

    return membership.group.members.map(m => ({
        id: m.id,
        name: m.name,
        role: m.role,
        relation: m.relation,
        monthlyLimit: m.monthlyLimit,
        isAccepted: m.isAccepted,
        email: m.email || m.user?.email,
        avatarUrl: m.user?.avatarUrl || null,
        isCurrentUser: m.userId === userId
    }));
  }

  async inviteMember(userId: string, data: InviteMemberDto) {
    // 1. Get or Create Group logic
    let memberGroupId: string;
    let currentMembersCount = 0;

    const membership = await this.prisma.member.findFirst({
        where: { userId },
        include: { group: { include: { members: true } } }
    });

    if (membership) {
        memberGroupId = membership.memberGroupId;
        currentMembersCount = membership.group.members.length;
        // Verify permissions
        if (membership.role !== 'HEAD' && membership.role !== 'SPOUSE') {
            throw new BadRequestException('Only Group Head or Spouse can invite members');
        }
    } else {
        // Create new Group for this user (they become HEAD)
        const memberGroup = await this.prisma.memberGroup.create({
            data: { name: 'My Group' }
        });
        memberGroupId = memberGroup.id;
        
        // Add current user as HEAD
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        await this.prisma.member.create({
            data: {
                memberGroupId,
                userId,
                name: user.name,
                role: 'HEAD',
                relation: 'You',
                isAccepted: true,
                email: user.email 
            }
        });
        currentMembersCount = 1;
    }

    // Check Plan Limits
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const plan = user.plan || 'FREE';
    
    let limit = 1; // FREE
    if (plan === 'BASIC') limit = 4;
    if (plan === 'MEMBERS') limit = 10;

    if (currentMembersCount >= limit) {
        throw new BadRequestException(`Upgrade to add more members. Your ${plan} plan limit is ${limit} members.`);
    }

    // 2. Add new member
    const existingMember = await this.prisma.member.findFirst({
        where: { memberGroupId, email: data.email }
    });

    if (existingMember) {
        throw new BadRequestException('This email is already invited');
    }
    
    // Check if invited user exists in system
    const invitedUser = await this.prisma.user.findUnique({ where: { email: data.email } });

    const newMember = await this.prisma.member.create({
        data: {
            memberGroupId,
            userId: invitedUser?.id || null,
            name: data.name,
            email: data.email,
            role: data.role as MemberRole || 'MEMBER',
            relation: data.relation,
            monthlyLimit: data.monthlyLimit,
            isAccepted: false // Pending invitation
        }
    });

    // 3. Send Email
    const inviter = await this.prisma.user.findUnique({ where: { id: userId } });
    const inviteUrl = `${this.configService.get('FRONTEND_URL')}/members/accept?token=${newMember.id}`;

    await this.mailerService.sendMail({
        to: data.email,
        subject: `Group Invitation from ${inviter.name}`,
        template: 'member-invite',
        context: {
            frontendUrl: this.configService.get('FRONTEND_URL'),
            inviterName: inviter.name,
            role: data.role,
            url: inviteUrl
        }
    });

    return newMember;
  }

  async removeMember(userId: string, memberId: string) {
    await this.prisma.member.delete({
        where: { id: memberId }
    });
  }
}
