import { IsArray, IsInt, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSetupDto {
  @ApiProperty({ example: ['BCA', 'Gopay', 'Permata'], required: false })
  @IsOptional()
  @IsArray()
  accountSummary?: string[];

  @ApiProperty({ example: ['Monthly Salary', 'Bonus'], required: false })
  @IsOptional()
  @IsArray()
  incomeSources?: string[];

  @ApiProperty({ example: ['Home Rent', 'Course', 'Utilities'], required: false })
  @IsOptional()
  @IsArray()
  needs?: string[];

  @ApiProperty({ example: ['Shopping', 'Entertainment'], required: false })
  @IsOptional()
  @IsArray()
  wants?: string[];

  @ApiProperty({ example: ['General Savings', 'Emergency Funds'], required: false })
  @IsOptional()
  @IsArray()
  savings?: string[];

  @ApiProperty({ example: ['General Savings', 'Bibit'], required: false })
  @IsOptional()
  @IsArray()
  accountAssets?: string[];

  @ApiProperty({ example: 5, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  paydayDate?: number;
}
