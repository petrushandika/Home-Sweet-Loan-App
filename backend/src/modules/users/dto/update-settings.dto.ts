import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class UpdateSettingsDto {
  @ApiPropertyOptional({ example: 1000000000 })
  @IsNumber()
  @IsOptional()
  assetsTarget?: number;

  @ApiPropertyOptional({ example: 'IDR' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({ example: 'id' })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiPropertyOptional({ example: 'dark' })
  @IsString()
  @IsOptional()
  theme?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  emailNotif?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  pushNotif?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  marketingNotif?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  twoFactorEnabled?: boolean;
}
