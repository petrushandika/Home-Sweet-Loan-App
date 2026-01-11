import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDateString, IsUUID } from 'class-validator';

export class CreateSpendingDto {
  @ApiProperty({ example: 'Dinner at Suasanas' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 150000 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'FOOD' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiPropertyOptional({ example: '2023-11-20T10:00:00Z' })
  @IsDateString()
  @IsOptional()
  date?: string | Date;

  @ApiPropertyOptional({ example: 'Dinner with family' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Asset ID if paid using an asset (e.g. Bank Account)' })
  @IsUUID()
  @IsOptional()
  assetId?: string;
}
