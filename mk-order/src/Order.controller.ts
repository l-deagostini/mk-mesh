import {
  Controller,
  Logger,
  NotFoundException,
  ParseEnumPipe,
} from '@nestjs/common';
import { OrderService } from './Order.service';
import { RmqOrderCommands } from './shared/RmqCommands';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderDocument } from './schemas/Order.schema';
import OrderStatus from './enums/OrderStatus';

@Controller()
export class OrderController {
  private readonly logger = new Logger(OrderController.name);
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern(RmqOrderCommands.GET_ORDER)
  async getOrdersByUserId(
    @Payload('id')
    userId: string,
  ): Promise<OrderDocument[]> {
    this.logger.debug(`Getting orders for user ID ${userId}`);
    const result = await this.orderService.getOrdersByUserId(userId);
    return result;
  }

  @MessagePattern(RmqOrderCommands.CONFIRM_ORDER)
  async addItemToBasket(
    @Payload('id')
    userId: string,
  ): Promise<OrderDocument> {
    this.logger.debug(`Confirming order for user[${userId}]`);
    const result = await this.orderService.confirmOrder(userId);
    return result;
  }

  @MessagePattern(RmqOrderCommands.UPDATE_STATUS)
  async updateOrderStatus(
    @Payload('orderId')
    orderId: string,
    @Payload('status', new ParseEnumPipe(OrderStatus))
    newStatus: OrderStatus,
  ): Promise<OrderDocument> {
    this.logger.debug(`Getting basket with user ID ${orderId}`);
    const result = await this.orderService.updateOrderStatus(
      orderId,
      newStatus,
    );
    if (result) {
      return result;
    }
    throw new NotFoundException('No order found with ID ' + orderId);
  }
}
