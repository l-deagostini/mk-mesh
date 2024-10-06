import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

@Exclude()
export class BasketItemDto {
  @IsNotEmpty()
  @Expose()
  id: string;

  @IsNotEmpty()
  @IsNumber()
  @Expose()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  @Expose()
  total: number;

  @IsNotEmpty()
  @IsNumber()
  @Expose()
  price: number;
}
