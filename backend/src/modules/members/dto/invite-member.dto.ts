import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsEnum, IsNumber, Min } from 'class-validator';

export class InviteMemberDto {
  @ApiProperty({ example: 'Sister Jane' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'jane@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ enum: ['MEMBER', 'ADMIN'], example: 'MEMBER' })
  @IsEnum(['MEMBER', 'ADMIN'])
  role: string;

  @ApiProperty({ example: 'SISTER' })
  @IsString()
  relation: string;

  @ApiProperty({ example: 5000000 })
  @IsNumber()
  @Min(0)
  monthlyLimit: number;
}
