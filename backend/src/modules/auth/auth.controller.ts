import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Req, Res, UnauthorizedException } from '@nestjs/common';
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
  async register(@Body() registerDto: RegisterDto, @Res({ passthrough: true }) res) {
    const result = await this.authService.register(registerDto);
    this.setCookies(res, result.accessToken, result.refreshToken);
    return {
      success: true,
      data: result.user,
      message: 'User registered successfully',
    };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res) {
    const result = await this.authService.login(loginDto);
    this.setCookies(res, result.accessToken, result.refreshToken);
    return {
      success: true,
      data: result.user,
      message: 'Login successful',
    };
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Reset link sent' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const result = await this.authService.forgotPassword(forgotPasswordDto);
    return {
      success: true,
      message: result.message,
    };
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
      message: result.message,
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
    return {
      success: true,
      message: result.message,
    };
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
      message: result.message,
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
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback`);
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
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback`);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  async logout(@Req() req, @Res({ passthrough: true }) res) {
    const userId = req.user?.id;
    if (userId) {
        await this.authService.logout(userId);
    }
    
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    
    return {
        success: true,
        message: 'Logged out successfully',
    };
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
        message: 'Tokens refreshed successfully',
    };
  }
  @Post('change-password')
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  async changePassword(@CurrentUser() user: any, @Body() changePasswordDto: ChangePasswordDto) {
    const result = await this.authService.changePassword(user.id, changePasswordDto);
    return {
      success: true,
      message: result.message,
    };
  }
}
