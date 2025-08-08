import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Wireless Mouse',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'A wireless mouse with ergonomic design.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Product price',
    example: 29.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Product stock quantity',
    example: 100,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({
    description: 'Product SKU (Stock Keeping Unit)',
    example: 'SKU-001',
  })
  @IsString()
  @IsNotEmpty()
  sku: string;
}