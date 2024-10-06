import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BasketItemDto } from './BasketItem.dto';

@Exclude()
export class BasketDto {
  @IsNotEmpty()
  @IsMongoId()
  @Expose({ name: '_id' })
  @ApiProperty({
    description: 'Identifier of the basket',
  })
  id: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'userId' })
  @ApiProperty({
    description: 'User ID associated with the basket',
  })
  user: string;

  @Expose()
  @ApiProperty({
    description: 'Items in the basket',
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
    description: 'Total cost of the basket',
  })
  totalPrice: number;

  @IsNotEmpty()
  @IsNumber()
  @Expose()
  @ApiProperty({
    description: 'Amount of items in the basket',
  })
  totalItems: number;

  @IsNotEmpty()
  @IsDateString()
  @Expose()
  @ApiProperty({
    description: 'When this basket was last updated',
  })
  updatedAt: Date;

  @IsNotEmpty()
  @IsDateString()
  @Expose()
  @ApiProperty({
    description: 'When this basket was created',
  })
  createdAt: Date;
}
