import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, Min } from 'class-validator';
import { AssetType } from '@prisma/client';

export class CreateAssetDto {
  @ApiProperty({ enum: AssetType, example: AssetType.LIQUID })
  @IsEnum(AssetType)
  type: AssetType;

  @ApiProperty({ example: 'Bank Central Asia' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 50000000 })
  @IsNumber()
  @Min(0)
  value: number;

  @ApiProperty({ example: 'Savings' })
  @IsString()
  @IsNotEmpty()
  account: string;
}
