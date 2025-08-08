import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { I18nService } from 'nestjs-i18n';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiHeader,
  ApiParam,
} from '@nestjs/swagger';
import { OrderResponseDto } from './dto/order-response.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@ApiHeader({
  name: 'Accept-Language',
  description: 'Preferred language (e.g., "en", "ar")',
  required: false,
  example: 'en',
})
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly i18nService: I18nService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully', type: OrderResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request (e.g. missing items)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @ApiOperation({ summary: "Get current user's orders" })
  @ApiResponse({ status: 200, description: 'List of the user orders', type: [OrderResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserOrders(@CurrentUser('id') userId: number) {
    const orders = await this.ordersService.getUserOrders(userId);
    return {
      message: this.i18nService.t('order.user_orders_success'),
      data: orders,
    };
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all orders (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of all orders', type: [OrderResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admins only' })
  async getAllOrders(@CurrentUser('role') role: UserRole) {
    const orders = await this.ordersService.getAllOrders(role);
    return {
      message: this.i18nService.t('order.all_orders_success'),
      data: orders,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'The ID of the order to delete' })
  @ApiResponse({ status: 200, description: 'Order deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admins only' })
  @ApiResponse({ status: 404, description: 'Order not found' })
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
