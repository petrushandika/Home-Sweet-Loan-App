import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Public } from '@/common/decorators/public.decorator';
import { GoogleAuthGuard } from '@/common/guards/google-auth.guard';
import { FacebookAuthGuard } from '@/common/guards/facebook-auth.guard';
import { ResponseMessage } from '@/common/decorators/response-message.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setCookies(res: any, accessToken: string, refreshToken: string) {
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ResponseMessage('Account created! Please check your email to verify your account.')
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    return result.user;
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ResponseMessage('Login successful')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res) {
    const result = await this.authService.login(loginDto);
    this.setCookies(res, result.accessToken, result.refreshToken);
    return result;
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Reset link sent' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const result = await this.authService.forgotPassword(forgotPasswordDto);
    return result.message; // Just return message or null, interceptor wraps it
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const result = await this.authService.resetPassword(resetPasswordDto);
    return {
      success: true,
      statusCode: 200,
      message: result.message,
      data: null,
    };
  }

  @Public()
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 401, description: 'Invalid token' })
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    const result = await this.authService.verifyEmail(verifyEmailDto);
    return result.message;
  }

  @Public()
  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend verification email' })
  @ApiResponse({ status: 200, description: 'Verification link resent' })
  async resendVerification(@Body() resendVerificationDto: ResendVerificationDto) {
    const result = await this.authService.resendVerification(resendVerificationDto.email);
    return {
      success: true,
      statusCode: 200,
      message: result.message,
      data: null,
    };
  }

  @Public()
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Login with Google' })
  async googleLogin() {
    // Initiates the Google OAuth2 flow
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Google login callback' })
  async googleLoginCallback(@Req() req, @Res() res) {
    const result = await this.authService.validateSocialUser(req.user);
    this.setCookies(res, result.accessToken, result.refreshToken);
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${result.accessToken}`);
  }

  @Public()
  @Get('facebook')
  @UseGuards(FacebookAuthGuard)
  @ApiOperation({ summary: 'Login with Facebook' })
  async facebookLogin() {
    // Initiates the Facebook OAuth2 flow
  }

  @Public()
  @Get('facebook/callback')
  @UseGuards(FacebookAuthGuard)
  @ApiOperation({ summary: 'Facebook login callback' })
  async facebookLoginCallback(@Req() req, @Res() res) {
    const result = await this.authService.validateSocialUser(req.user);
    this.setCookies(res, result.accessToken, result.refreshToken);
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${result.accessToken}`);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  @ResponseMessage('Logged out successfully')
  async logout(@Req() req, @Res({ passthrough: true }) res) {
    const userId = req.user?.id;
    if (userId) {
      await this.authService.logout(userId);
    }

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return null;
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(@Req() req, @Res({ passthrough: true }) res) {
    const refreshToken = req.cookies['refresh_token'];

    if (!refreshToken) throw new UnauthorizedException('Refresh token not found');

    // Basic decoding to get payload (simulating Strategy extraction)
    // NOTE: In production, use a proper Guard + Strategy
    const base64Url = refreshToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(Buffer.from(base64, 'base64').toString());

    if (!payload.sub) throw new UnauthorizedException('Invalid token');

    const tokens = await this.authService.refreshTokens(payload.sub, refreshToken);
    this.setCookies(res, tokens.accessToken, tokens.refreshToken);

    return {
      success: true,
      statusCode: 200,
      message: 'Tokens refreshed successfully',
      data: null,
    };
  }
  @Post('change-password')
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  async changePassword(@CurrentUser() user: any, @Body() changePasswordDto: ChangePasswordDto) {
    const result = await this.authService.changePassword(user.id, changePasswordDto);
    return result.message;
  }
}
