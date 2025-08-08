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
    const { name, description, price, stock, sku } = dto;

  if (!name || !description || !price || !stock || !sku) {
    throw new BadRequestException(this.i18nService.t('product.missing_fields'));
  }

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
    // return await this.prismaService.product.findMany();
    return await this.prismaService.product.findMany({
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    // const product = await this.prismaService.product.findUnique({ where: { id } });
    const product = await this.prismaService.product.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

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