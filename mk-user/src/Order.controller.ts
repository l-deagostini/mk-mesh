import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UseFilters,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RcpExceptionFilter } from './exceptions/RpcExceptionFilter';
import OpenApiTags from './enums/OpenApiTags';
import { UpdateOrderStatusDto } from './dto/UpdateOrderStatus.dto';
import { OrderService } from './Order.service';
import { OrderDto } from './dto/Order.dto';
import { IdDto } from './dto/Id.dto';

@ApiTags(OpenApiTags.ORDER)
@Controller({
  path: 'order',
  version: '1',
})
export class OrderController {
  private readonly logger = new Logger(OrderController.name);
  constructor(private readonly orderService: OrderService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Returns the orders associated with the specified user ID',
  })
  @ApiOkResponse({
    type: OrderDto,
    isArray: true,
    description: 'The orders associated with the specified user ID',
  })
  @UseFilters(new RcpExceptionFilter())
  async getOrdersByUserId(@Param('id') userId: string): Promise<OrderDto[]> {
    this.logger.debug(`Forwarding request to service... (id:"${userId}")`);
    const result = await this.orderService.getOrdersByUserId({ id: userId });
    this.logger.verbose(`Found items: ${result.length}`);
    return result;
  }

  @Post('confirm')
  @ApiOperation({
    summary:
      'Confirms the current basket associated with the specified user ID',
  })
  @ApiOkResponse({
    type: OrderDto,
    isArray: false,
    description: 'Confirmed order',
  })
  @ApiBody({ type: IdDto, isArray: false })
  @UseFilters(new RcpExceptionFilter())
  async confirmBasketByUserId(
    @Body()
    operation: IdDto,
  ): Promise<OrderDto> {
    const result = await this.orderService.confirmOrder({
      id: operation.id,
    });
    return result;
  }

  @Post('update')
  @ApiOperation({
    summary: 'Updates the status of the order associated with the specified ID',
  })
  @ApiOkResponse({
    type: OrderDto,
    isArray: false,
    description: 'Order after its status has been updated',
  })
  @ApiBody({ type: UpdateOrderStatusDto, isArray: false })
  @UseFilters(new RcpExceptionFilter())
  async updateOrderStatus(
    @Body()
    operation: UpdateOrderStatusDto,
  ): Promise<OrderDto> {
    const result = await this.orderService.updateOrderStatus({
      orderId: operation.orderId,
      status: operation.newStatus,
    });
    return result;
  }
}
