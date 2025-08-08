import { ApiProperty } from '@nestjs/swagger';

class OrderItemDto {
  @ApiProperty({ example: '1' })
  product_id: string;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ example: 29.99 })
  price_at_purchase: number;
}

class OrderUserDto {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;
}

export class OrderResponseDto {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ type: [OrderItemDto] })
  items: OrderItemDto[];

  @ApiProperty({ example: 89.97 })
  total_price: number;

  @ApiProperty({ type: OrderUserDto })
  user: OrderUserDto;

  @ApiProperty({ example: '2025-08-08T10:15:30.000Z', format: 'date-time' })
  created_at: string;

  @ApiProperty({ example: '2025-08-08T10:15:30.000Z', format: 'date-time' })
  updated_at: string;
}
