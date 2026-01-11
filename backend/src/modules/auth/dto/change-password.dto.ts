import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'CurrentPassword123' })
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({ example: 'NewPassword123' })
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}
