import { Exclude, Expose } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

@Exclude()
export class CatalogueItemDto {
  @IsNotEmpty()
  @IsMongoId()
  @Expose({ name: '_id' })
  id: string;

  @IsNumber()
  @IsPositive()
  @Expose()
  price: number;
}
