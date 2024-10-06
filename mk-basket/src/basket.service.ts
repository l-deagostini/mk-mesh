import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Basket, BasketDocument, BasketItem } from './schemas/Basket.schema';
import ConnectionNames from './enums/ConnectionNames';
import { Model } from 'mongoose';
import ServiceNames from './enums/ServiceNames';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { RmqCatalogueCommands } from './shared/RmqCommands';
import { CatalogueItemDto } from './dto/CatalogueItem.dto';
import { IdPayload } from './shared/RmqPayloads';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class BasketService {
  constructor(
    @Inject(ServiceNames.CATALOGUE_SERVICE)
    private catalogueClient: ClientProxy,
    @InjectModel(Basket.name, ConnectionNames.BASKET)
    private readonly basketModel: Model<BasketDocument>,
  ) {}
  private readonly logger = new Logger(BasketService.name);

  async getAll(): Promise<BasketDocument[]> {
    this.logger.debug('Getting baskets');
    return await this.basketModel.find().exec();
  }

  async getBasketByUserId(id: string): Promise<BasketDocument> {
    this.logger.debug(`Fetching basket ${id}`);
    const result = await this.basketModel
      .findOne<BasketDocument>({ userId: id })
      .exec();
    return result;
  }

  async addBasketItem(
    userId: string,
    itemId: string,
    quantity = 1,
  ): Promise<BasketDocument> {
    this.logger.debug(`Adding item[${itemId}] to user[${userId}]`);
    // need to do it just once, so we can just put it here instead of creating a service
    const data = await firstValueFrom<CatalogueItemDto>(
      this.catalogueClient
        .send(RmqCatalogueCommands.GET_ITEM, { id: itemId } as IdPayload)
        .pipe(timeout(5000)),
    );
    const item = plainToClass(CatalogueItemDto, data);
    await validate(item);
    this.logger.debug(`Catalogue item: [${item.id}][${item.price}]`);
    const basket = await this.basketModel.findOne({ userId: userId }).exec();
    if (basket) {
      const basketItem = basket.items.find((i) => i.id === item.id);
      if (basketItem) {
        basketItem.quantity += quantity;
      } else {
        basket.items.push({
          id: item.id,
          price: item.price,
          quantity: quantity,
        });
      }
      basket.save();
      return basket;
    }
    const basketItem: BasketItem = {
      id: item.id,
      price: item.price,
      quantity: quantity,
    };
    const newBasket = await this.basketModel.create({
      userId: userId,
      items: [basketItem],
    });
    return await newBasket.save();
  }
}
