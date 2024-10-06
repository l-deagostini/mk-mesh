import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import ServiceNames from './enums/ServiceNames';
import { ConfigService } from '@nestjs/config';
import { RmqBasketCommands } from './shared/RmqCommands';
import { AddToBasketPayload, IdPayload } from './shared/RmqPayloads';
import { BasketDto } from './dto/Basket.dto';
import { plainToClass } from 'class-transformer';
import { isArray, validate } from 'class-validator';

@Injectable()
export class BasketService {
  private readonly logger = new Logger(BasketService.name);
  private readonly REQUEST_TIMEOUT: number;

  constructor(
    private configService: ConfigService,
    @Inject(ServiceNames.BASKET_SERVICE)
    private basketClient: ClientProxy,
  ) {
    this.REQUEST_TIMEOUT = this.configService.get<number>('REQUEST_TIMEOUT');
    this.logger.debug(`Request timeout set to ${this.REQUEST_TIMEOUT}ms`);
  }

  async getBasketByUserId(payload: IdPayload): Promise<BasketDto | undefined> {
    this.logger.debug(
      `Requesting data from client [${RmqBasketCommands.GET_BASKET}:{id:"${payload.id}"}]`,
    );
    const result = await firstValueFrom<BasketDto>(
      this.basketClient
        .send(RmqBasketCommands.GET_BASKET, payload)
        .pipe(timeout(this.REQUEST_TIMEOUT)),
    );
    if (!result) {
      return undefined;
    }
    const dto = await this.toBasketDto(result);
    this.logger.debug(`Data received [${dto.at(0)?.id}]`);
    return dto.at(0);
  }

  async addItemsToBasket(
    payload: AddToBasketPayload,
  ): Promise<BasketDto | undefined> {
    this.logger.debug(
      `Requesting data from client [${RmqBasketCommands.ADD_TO_BASKET}:{userId:"${payload.userId}",itemId:"${payload.itemId}"}]`,
    );
    const result = await firstValueFrom<BasketDto>(
      this.basketClient
        .send(RmqBasketCommands.ADD_TO_BASKET, payload)
        .pipe(timeout(this.REQUEST_TIMEOUT)),
    );
    if (!result) {
      return undefined;
    }
    const dto = await this.toBasketDto(result);
    this.logger.debug(`Data received [${dto.at(0)?.id}]`);
    return dto.at(0);
  }

  private async toBasketDto(data: any): Promise<BasketDto[]> {
    const dto = plainToClass(BasketDto, data);
    const errors = await validate(dto);
    if (errors.length > 0) {
      this.logger.error('Validation error while fetching basket');
      throw new Error(`Validation failed: ${errors}`);
    }
    return isArray(dto) ? dto : [dto];
  }
}
