import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

@Exclude()
export class AddBasketDto {
  @IsNotEmpty()
  @IsString()
  @Expose()
  @ApiProperty({
    description: 'User ID associated with the basket',
  })
  userId: string;

  @Expose()
  @ApiProperty({
    description: 'Item to add to the basket',
    isArray: false,
  })
  itemId: string;

  @Expose()
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description:
      'Quantity of the items to add. Can be negative if removing items',
    default: 1,
  })
  quantity: number = 1;
}
