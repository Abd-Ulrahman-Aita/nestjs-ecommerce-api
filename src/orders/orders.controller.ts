import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { I18nService } from 'nestjs-i18n';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly i18nService: I18nService
  ) {}

  @Post()
  async createOrder(
    @CurrentUser('id') userId: number,
    @Body() dto: CreateOrderDto
  ) {
    const order = await this.ordersService.createOrder(userId, dto);
    return {
      message: this.i18nService.t('order.created_success'),
      data: order,
    };
  }

  @Get()
  async getUserOrders(@CurrentUser('id') userId: number) {
    const orders = await this.ordersService.getUserOrders(userId);
    return {
      message: this.i18nService.t('order.user_orders_success'),
      data: orders,
    };
  }

  @Get('all')
  async getAllOrders(@CurrentUser('role') role: UserRole) {
    const orders = await this.ordersService.getAllOrders(role);
    return {
      message: this.i18nService.t('order.all_orders_success'),
      data: orders,
    };
  }

  @Delete(':id')
  async deleteOrderById(
    @Param('id') id: string,
    @CurrentUser('role') role: UserRole
  ) {
    await this.ordersService.deleteOrderById(+id, role);
    return {
      message: this.i18nService.t('order.deleted_success'),
    };
  }
}
