import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

@Exclude()
export class BasketItemDto {
  @IsNotEmpty()
  @Expose()
  @ApiProperty({
    description: 'ID of the catalogue item',
  })
  id: string;

  @IsNotEmpty()
  @IsNumber()
  @Expose()
  @ApiProperty({
    description: 'Quantity of items in the basket',
  })
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  @Expose()
  @ApiProperty({
    description: 'Total cost of these items',
  })
  total: number;

  @IsNotEmpty()
  @IsNumber()
  @Expose()
  @ApiProperty({
    description: 'Price per unit of this item',
  })
  price: number;
}
