import { Controller, Logger } from '@nestjs/common';
import { BasketService } from './Basket.service';
import { RmqBasketCommands } from './shared/RmqCommands';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BasketDocument } from './schemas/Basket.schema';

@Controller()
export class BasketController {
  private readonly logger = new Logger(BasketController.name);
  constructor(private readonly basketService: BasketService) {}

  @MessagePattern(RmqBasketCommands.GET_BASKET)
  async getBasketByUserId(
    @Payload('id')
    id: string,
  ): Promise<BasketDocument> {
    this.logger.debug(`Getting basket with user ID ${id}`);
    const result = await this.basketService.getBasketByUserId(id);
    return result;
  }

  @MessagePattern(RmqBasketCommands.ADD_TO_BASKET)
  async addItemToBasket(
    @Payload('userId')
    userId: string,
    @Payload('itemId')
    itemId: string,
    @Payload('quantity')
    quantity: number,
  ): Promise<BasketDocument> {
    this.logger.debug(`Adding item[${itemId}] to based of user[${userId}]`);
    const result = await this.basketService.addBasketItem(
      userId,
      itemId,
      quantity,
    );
    return result;
  }
}
