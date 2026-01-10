import { IsString, IsObject, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBudgetDto {
  @ApiProperty({ example: '2026-01' })
  @IsString()
  yearMonth: string;

  @ApiProperty({ example: { 'Monthly Salary': 6430000, 'Bonus': 0 } })
  @IsOptional()
  @IsObject()
  income?: Record<string, number>;

  @ApiProperty({ example: { 'General Savings': 500000, 'Emergency Funds': 300000 } })
  @IsOptional()
  @IsObject()
  savingsAllocation?: Record<string, number>;

  @ApiProperty({ example: { 'Home Rent': 1700000, 'Course': 150000 } })
  @IsOptional()
  @IsObject()
  expenses?: Record<string, number>;
}
