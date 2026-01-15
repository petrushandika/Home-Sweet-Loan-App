import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CategoryType } from './add-item.dto';

export class UpdateItemDto {
  @ApiProperty({
    example: 'accountSummary',
    enum: CategoryType,
    description: 'Category type the item belongs to',
  })
  @IsNotEmpty()
  @IsEnum(CategoryType)
  category: CategoryType;

  @ApiProperty({
    example: 'Old Item Name',
    description: 'The current name of the item to update',
  })
  @IsNotEmpty()
  @IsString()
  oldItemName: string;

  @ApiProperty({
    example: 'New Item Name',
    description: 'The new name for the item',
  })
  @IsNotEmpty()
  @IsString()
  newItemName: string;
}
