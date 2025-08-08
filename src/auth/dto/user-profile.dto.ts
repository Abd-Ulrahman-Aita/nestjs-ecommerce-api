import { ApiProperty } from '@nestjs/swagger';

class UserDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() email: string;
  @ApiProperty() role: string;
  @ApiProperty() isVerified: boolean;
  @ApiProperty({ format: 'date-time' }) createdAt: string;
}

export class UserProfileDto {
  @ApiProperty({ type: UserDto })
  user: UserDto;
}
