import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import ServiceNames from './enums/ServiceNames';
import { ConfigService } from '@nestjs/config';
import { RmqOrderCommands } from './shared/RmqCommands';
import { IdPayload, UpdateOrderStatusPayload } from './shared/RmqPayloads';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { OrderDto } from './dto/Order.dto';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  private readonly REQUEST_TIMEOUT: number;

  constructor(
    private configService: ConfigService,
    @Inject(ServiceNames.ORDER_SERVICE)
    private orderClient: ClientProxy,
  ) {
    this.REQUEST_TIMEOUT = this.configService.get<number>('REQUEST_TIMEOUT');
    this.logger.debug(`Request timeout set to ${this.REQUEST_TIMEOUT}ms`);
  }

  async getOrdersByUserId(payload: IdPayload): Promise<OrderDto[]> {
    this.logger.debug(
      `Requesting data from client [${RmqOrderCommands.GET_ORDER}:{id:"${payload.id}"}]`,
    );
    const result = await firstValueFrom<OrderDto[]>(
      this.orderClient
        .send(RmqOrderCommands.GET_ORDER, payload)
        .pipe(timeout(this.REQUEST_TIMEOUT)),
    );
    const dto = plainToInstance(OrderDto, result);
    await validate(dto);
    this.logger.debug(`Data received [total:${dto.length}]`);
    return dto;
  }

  async confirmOrder(payload: IdPayload): Promise<OrderDto> {
    this.logger.debug(
      `Requesting data from client [${RmqOrderCommands.CONFIRM_ORDER}:{userId:"${payload.id}"`,
    );
    const result = await firstValueFrom<OrderDto>(
      this.orderClient
        .send(RmqOrderCommands.CONFIRM_ORDER, payload)
        .pipe(timeout(this.REQUEST_TIMEOUT)),
    );
    const dto = plainToInstance(OrderDto, result);
    await validate(dto);
    this.logger.debug(`Data received [${dto.id}]`);
    return dto;
  }

  async updateOrderStatus(
    payload: UpdateOrderStatusPayload,
  ): Promise<OrderDto> {
    this.logger.debug(
      `Requesting data from client [${RmqOrderCommands.UPDATE_STATUS}:{orderId:"${payload.orderId}",newStatus:${payload.status}`,
    );
    const result = await firstValueFrom<OrderDto>(
      this.orderClient
        .send(RmqOrderCommands.UPDATE_STATUS, payload)
        .pipe(timeout(this.REQUEST_TIMEOUT)),
    );
    const dto = plainToInstance(OrderDto, result);
    await validate(dto);
    this.logger.debug(`Data received [${dto.id}]`);
    return dto;
  }
}
