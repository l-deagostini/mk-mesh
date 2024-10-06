import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

@Exclude()
export class CatalogueItemDto {
  @IsNotEmpty()
  @IsMongoId()
  @Expose({ name: '_id' })
  @ApiProperty({
    description: 'Identifier of the catalogue item',
  })
  id: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  @ApiProperty({
    description: 'Name of the catalogue item',
  })
  name: string;

  @IsOptional()
  @IsString()
  @Expose()
  @ApiPropertyOptional({
    description: 'Optional description of the catalogue item',
  })
  description?: string;

  @IsNumber()
  @Min(0)
  @Expose()
  @ApiProperty({
    description: 'Price of the catalogue item',
    minimum: 0,
  })
  price: number;
}
