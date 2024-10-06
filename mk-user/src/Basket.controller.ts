import {
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Post,
  UseFilters,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RcpExceptionFilter } from './exceptions/RpcExceptionFilter';
import OpenApiTags from './enums/OpenApiTags';
import { BasketService } from './Basket.service';
import { BasketDto } from './dto/Basket.dto';
import { AddBasketDto } from './dto/AddBasket.dto';

@ApiTags(OpenApiTags.BASKET)
@Controller({
  path: 'basket',
  version: '1',
})
export class BasketController {
  private readonly logger = new Logger(BasketController.name);
  constructor(private readonly basketService: BasketService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Returns the basket associated with the specified user ID',
  })
  @ApiOkResponse({
    type: BasketDto,
    isArray: true,
    description: 'The basket associated with the specified user ID',
  })
  @UseFilters(new RcpExceptionFilter())
  async getBasketByUserId(@Param('id') userId: string): Promise<BasketDto> {
    this.logger.debug(`Forwarding request to service... (id:"${userId}")`);
    const result = await this.basketService.getBasketByUserId({ id: userId });
    this.logger.verbose(`Found item: ${result?.id}`);
    if (!result) {
      throw new NotFoundException(
        'No basket associated with user with ID ' + userId,
      );
    }
    return result;
  }

  @Post('add')
  @ApiOperation({
    summary: "Add the specified item to the specified user ID's basket",
  })
  @ApiOkResponse({
    type: BasketDto,
    isArray: false,
    description: 'Basket after the item has been added',
  })
  @ApiBody({ type: AddBasketDto, isArray: false })
  @UseFilters(new RcpExceptionFilter())
  async addItemsToBasket(
    @Body()
    operation: AddBasketDto,
  ): Promise<BasketDto> {
    const result = await this.basketService.addItemsToBasket({
      itemId: operation.itemId,
      userId: operation.userId,
      quantity: operation.quantity,
    });
    return result;
  }
}
