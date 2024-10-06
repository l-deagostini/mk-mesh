import { Inject, Injectable, Logger } from '@nestjs/common';
import ServiceNames from './enums/ServiceNames';
import { ClientProxy } from '@nestjs/microservices';
import ConnectionNames from './enums/ConnectionNames';
import { Order, OrderDocument } from './schemas/Order.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { firstValueFrom, timeout } from 'rxjs';
import { RmqBasketCommands } from './shared/RmqCommands';
import { IdPayload } from './shared/RmqPayloads';
import { BasketDto } from './dto/Basket.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import OrderStatus from './enums/OrderStatus';

@Injectable()
export class OrderService {
  constructor(
    @Inject(ServiceNames.BASKET_SERVICE)
    private basketClient: ClientProxy,
    @InjectModel(Order.name, ConnectionNames.ORDER)
    private readonly orderModel: Model<OrderDocument>,
  ) {}
  private readonly logger = new Logger(OrderService.name);

  async getOrdersByUserId(userId: string): Promise<OrderDocument[]> {
    this.logger.debug(`Fetching orders for user[${userId}]`);
    const result = await this.orderModel
      .find<OrderDocument>({ userId: userId })
      .exec();
    return result;
  }

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
  ): Promise<OrderDocument | undefined> {
    this.logger.debug(
      `Updating status of order[${orderId}] to status[${status}]`,
    );
    const result = await this.orderModel
      .findOne<OrderDocument>({ _id: orderId })
      .exec();
    if (result) {
      result.status = status;
      return await result.save();
    }
    return undefined;
  }

  async confirmOrder(userId: string): Promise<OrderDocument> {
    this.logger.debug(`Confirming basket of user[${userId}]`);
    const data = await firstValueFrom<BasketDto>(
      this.basketClient
        .send(RmqBasketCommands.GET_BASKET, {
          id: userId,
        } as IdPayload)
        .pipe(timeout(5000)),
    );
    const basket = plainToInstance(BasketDto, data);
    await validate(basket);
    this.logger.debug(`Basket from user found [id:${basket.id}]`);
    const order = await this.orderModel.create({
      userId: userId,
      items: basket.items,
    });
    return await order.save();
  }
}
