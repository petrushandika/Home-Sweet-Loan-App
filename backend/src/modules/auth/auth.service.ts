import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/config/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import * as crypto from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        verificationToken,
      },
      select: {
        id: true,
        email: true,
        name: true,
        isVerified: true,
        createdAt: true,
      },
    });

    const verificationUrl = `${this.configService.get('FRONTEND_URL')}/auth/verify-email?token=${verificationToken}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify your email for Home Sweet Loan',
      template: 'verification',
      context: {
        name: user.name,
        url: verificationUrl,
      },
    });

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user,
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.password && (user.googleId || user.facebookId)) {
        throw new UnauthorizedException('Please login with your social account');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      ...tokens,
    };
  }

  async validateSocialUser(details: any) {
    const { email, firstName, lastName, picture, googleId, facebookId } = details;
    const name = `${firstName} ${lastName}`;

    let user = await this.prisma.user.findUnique({ where: { email } });

    if (user) {
        // If user exists, update social ID if missing
        if (googleId && !user.googleId) {
            user = await this.prisma.user.update({ where: { email }, data: { googleId, avatarUrl: user.avatarUrl || picture } });
        }
        if (facebookId && !user.facebookId) {
            user = await this.prisma.user.update({ where: { email }, data: { facebookId, avatarUrl: user.avatarUrl || picture } });
        }
    } else {
        // Create new user
        user = await this.prisma.user.create({
            data: {
                email,
                name,
                password: '', // Social logins don't have passwords initially
                avatarUrl: picture,
                googleId,
                facebookId,
                isVerified: true, // Trusted provider
                plan: 'FREE',
            },
        });
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
        user,
        ...tokens,
    };
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async logout(userId: string) {
    return this.prisma.user.updateMany({
        where: {
            id: userId,
            hashedRefreshToken: { not: null },
        },
        data: { hashedRefreshToken: null },
    });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
        where: { id: userId },
    });
    
    if (!user || !user.hashedRefreshToken)
        throw new UnauthorizedException('Access Denied');

    const refreshTokenMatches = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
    if (!refreshTokenMatches)
        throw new UnauthorizedException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    
    return tokens;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
        where: { id: userId },
        data: { hashedRefreshToken: hash },
    });
  }

  async getTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(
            { sub: userId, email },
            { secret: this.configService.get<string>('JWT_SECRET'), expiresIn: '15m' },
        ),
        this.jwtService.signAsync(
            { sub: userId, email },
            { secret: this.configService.get<string>('JWT_REFRESH_SECRET'), expiresIn: '7d' },
        ),
    ]);

    return {
        accessToken,
        refreshToken,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      return { message: 'If an account with that email exists, a reset link has been sent.' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await this.prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expires,
      },
    });

    const resetUrl = `${this.configService.get('FRONTEND_URL')}/auth/reset-password?token=${token}`;

    await this.mailerService.sendMail({
        to: email,
        subject: 'Reset your password for Home Sweet Loan',
        template: 'notification',
        context: {
          name: user.name,
          title: 'Reset User Password',
          message: 'You have requested to reset your password. Please click the link below to set a new password. This link will expire in 1 hour.',
          link: resetUrl,
        },
    });

    return { message: 'If an account with that email exists, a reset link has been sent.' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;

    const user = await this.prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gt: new Date() },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    return { message: 'Password has been reset successfully' };
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const { token } = verifyEmailDto;

    const user = await this.prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid verification token');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
      },
    });

    const dashboardUrl = `${this.configService.get('FRONTEND_URL')}/dashboard`;
    await this.mailerService.sendMail({
        to: user.email,
        subject: 'Welcome to Home Sweet Loan! 🏠',
        template: 'welcome',
        context: {
            frontendUrl: this.configService.get('FRONTEND_URL'),
            name: user.name,
            url: dashboardUrl
        }
    });

    return { message: 'Email verified successfully' };
  }

  async resendVerification(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.isVerified) {
      return { message: 'Email is already verified' };
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { verificationToken },
    });

    const verificationUrl = `${this.configService.get('FRONTEND_URL')}/auth/verify-email?token=${verificationToken}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify your email for Home Sweet Loan',
      template: 'verification',
      context: {
        name: user.name,
        url: verificationUrl,
      },
    });

    return { message: 'Verification link has been resent' };
  }
  async changePassword(userId: string, data: any) {
    const { currentPassword, newPassword } = data;
    
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new BadRequestException('Current password incorrect');

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashed }
    });

    return { message: 'Password changed successfully' };
  }
}
