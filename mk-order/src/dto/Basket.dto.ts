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
  id: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  userId: string;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => BasketItemDto)
  items: BasketItemDto[];

  @IsNotEmpty()
  @IsNumber()
  @Expose()
  totalPrice: number;

  @IsNotEmpty()
  @IsNumber()
  @Expose()
  totalItems: number;

  @IsNotEmpty()
  @IsDateString()
  @Expose()
  updatedAt: Date;

  @IsNotEmpty()
  @IsDateString()
  @Expose()
  createdAt: Date;
}
