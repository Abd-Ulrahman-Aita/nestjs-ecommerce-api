// import { PartialType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger'; // استخدم @nestjs/swagger بدلاً من @nestjs/mapped-types
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}