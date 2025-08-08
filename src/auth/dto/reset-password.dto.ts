import { IsEmail, IsString, MinLength, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Email address of the user resetting the password',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'One-time password (OTP) sent to email',
    example: '123456',
    minLength: 6,
    maxLength: 6,
  })
  @IsString()
  @Length(6, 6)
  otp: string;

  @ApiProperty({
    description: 'New password for the account',
    example: 'newStrongPassword123',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  newPassword: string;
}
