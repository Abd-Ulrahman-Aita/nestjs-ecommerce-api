import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UserRole } from '@prisma/client';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18nService: I18nService
  ) {}

  async create(userId: number, dto: CreateProductDto) {
    const { sku } = dto;

    // Check SKU uniqueness
    const existingProduct = await this.prismaService.product.findUnique({ where: { sku } });
    if (existingProduct) {
      throw new BadRequestException(this.i18nService.t('product.sku_exists'));
    }
    
    return await this.prismaService.product.create({
      data: {
        ...dto,
        owner: {
          connect: { id: userId },
        },
      },
    });
  }

  async findAll() {
    return await this.prismaService.product.findMany();
  }

  async findOne(id: number) {
    const product = await this.prismaService.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException(this.i18nService.t('product.not_found'));
    return product;
  }

  async update(
        id: number,
        userId: number,
        userRole: UserRole,
        dto: UpdateProductDto,
  ) {
    const product = await this.prismaService.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException(this.i18nService.t('product.not_found'));

    const isOwner = product.owner_id !== userId;
    const isAdmin = userRole !== UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(this.i18nService.t('auth.unauthorized'));
    }

    return await this.prismaService.product.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number, userId: number, userRole: UserRole) {
    const product = await this.prismaService.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException(this.i18nService.t('product.not_found'));

    const isOwner = product.owner_id !== userId;
    const isAdmin = userRole !== UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(this.i18nService.t('auth.unauthorized'));
    }

    return await this.prismaService.product.delete({ where: { id } });
  }
}