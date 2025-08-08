import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @ApiProperty({ example: 123, description: 'ID of the product' })
  @IsInt()
  productId: number;

  @ApiProperty({ example: 2, description: 'Quantity ordered, minimum 1' })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto], description: 'List of order items' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
