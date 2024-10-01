import { mixin } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, ValidateNested } from 'class-validator';

type Constructor<T = {}> = new (...args: any[]) => T;

export function withPaging<TBase extends Constructor>(
    Base: TBase,
    options?: ApiPropertyOptions | undefined,
) {
    class PageDto {

        @ApiProperty({
            description: 'The current page',
            example: 1,
        })
        @IsNumber()
        current: Number;

        @ApiProperty({
            description: 'The number of total pages',
            example: 10,
        })
        @IsNumber()
        total: number;

        @ApiProperty({
            description: 'The number of items in the page',
            example: 5,
        })
        @IsNumber()
        count: number;

        @ApiProperty({
            isArray: true,
            type: Base,
            ...options,
        })
        @Type(() => Base)
        @ValidateNested({ each: true })
        data!: Array<InstanceType<TBase>>;
    }
    return mixin(PageDto);
}