import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import OrderStatus from 'src/enums/OrderStatus';

@Exclude()
export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsString()
  @Expose()
  @ApiProperty({
    description: 'Order ID of the order',
  })
  orderId: string;

  @Expose()
  @ApiProperty({
    description: 'New status of the order',
    enum: OrderStatus,
  })
  @IsEnum(OrderStatus)
  newStatus: OrderStatus;
}
