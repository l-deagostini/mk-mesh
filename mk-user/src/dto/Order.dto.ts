import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BasketItemDto } from './BasketItem.dto';
import OrderStatus from 'src/enums/OrderStatus';

@Exclude()
export class OrderDto {
  @IsNotEmpty()
  @IsMongoId()
  @Expose({ name: '_id' })
  @ApiProperty({
    description: 'Identifier of the order',
  })
  id: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'userId' })
  @ApiProperty({
    description: 'User ID associated with the order',
  })
  user: string;

  @Expose()
  @ApiProperty({
    description: 'Items in the order',
    type: BasketItemDto,
    isArray: true,
  })
  @ValidateNested({ each: true })
  @Type(() => BasketItemDto)
  items: BasketItemDto[];

  @IsNotEmpty()
  @IsNumber()
  @Expose()
  @ApiProperty({
    description: 'Total cost of the order',
  })
  totalPrice: number;

  @IsNotEmpty()
  @IsNumber()
  @Expose()
  @ApiProperty({
    description: 'Amount of items in the order',
  })
  totalItems: number;

  @IsNotEmpty()
  @IsDateString()
  @Expose()
  @ApiProperty({
    description: 'When this order was last updated',
  })
  updatedAt: Date;

  @IsNotEmpty()
  @IsDateString()
  @Expose()
  @ApiProperty({
    description: 'When this order was created',
  })
  createdAt: Date;

  @Expose()
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Current status of the order',
  })
  status: OrderStatus;
}
