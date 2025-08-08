import { ApiProperty } from '@nestjs/swagger';

class OwnerDto {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;
}

export class ProductResponseDto {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: 'Wireless Mouse' })
  name: string;

  @ApiProperty({ example: 'A wireless mouse with ergonomic design.' })
  description: string;

  @ApiProperty({ example: 29.99 })
  price: number;

  @ApiProperty({ example: 100 })
  stock: number;

  @ApiProperty({ example: 'SKU-001' })
  sku: string;

  @ApiProperty({ type: OwnerDto })
  owner: OwnerDto;

  @ApiProperty({ example: '2025-08-08T10:15:30.000Z', format: 'date-time' })
  created_at: string;

  @ApiProperty({ example: '2025-08-08T10:15:30.000Z', format: 'date-time' })
  updated_at: string;
}
