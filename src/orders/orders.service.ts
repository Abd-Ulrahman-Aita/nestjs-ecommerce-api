import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UserRole } from '@prisma/client';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18nService: I18nService
  ) {}

  async createOrder(userId: number, dto: CreateOrderDto) {
    const { items } = dto;

    if (!items || items.length === 0) {
      throw new BadRequestException(this.i18nService.t('order.invalid_items'));
    }

    return this.prismaService.$transaction(async (tx) => {
      let totalPrice = 0;
      const orderItems: {
        product_id: number;
        quantity: number;
        price_at_purchase: number;
      }[] = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException({
            message: this.i18nService.t('order.product_not_found', { args: { id: item.productId } }),
            cause: { id: item.productId },
          });
          // throw new NotFoundException(`Product with ID ${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException({
            message: this.i18nService.t('order.insufficient_stock', { args: { product: product.name } }),
            cause: { product: product.name },
          });
          // throw new BadRequestException(`Insufficient stock for product: ${product.name}`);
        }

        totalPrice += product.price * item.quantity;

        // تحديث المخزون
        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: item.quantity } },
        });

        orderItems.push({
          product_id: product.id,
          quantity: item.quantity,
          price_at_purchase: product.price,
        });
      }

      const order = await tx.order.create({
        data: {
          user_id: userId,
          total_price: totalPrice,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      return order;
    });
  }

  async getUserOrders(userId: number) {
    return await this.prismaService.order.findMany({
      where: { user_id: userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async getAllOrders(role: UserRole) {
    if (role !== 'ADMIN') {
      throw new ForbiddenException(this.i18nService.t('auth.forbidden_admin'));
    }

    return await this.prismaService.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async deleteOrderById(id: number, role: UserRole) {
    if (role !== 'ADMIN') {
      throw new ForbiddenException(this.i18nService.t('auth.forbidden_admin'));
    }

    const order = await this.prismaService.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(this.i18nService.t('order.not_found'));
    }

    await this.prismaService.order.delete({
      where: { id },
    });

    return true;
  }
}
