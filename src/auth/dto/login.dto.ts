import { IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password (minimum 8 characters)',
    example: 'securePassword123',
    minLength: 8,
  })
  @MinLength(8)
  password: string;
}
