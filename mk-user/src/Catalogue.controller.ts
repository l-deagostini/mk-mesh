import { BadRequestException, Body, Controller, Get, HttpStatus, Logger, Param, ParseArrayPipe, ParseIntPipe, Post, Res, ValidationPipe, Version } from '@nestjs/common';
import { CatalogueService } from './Catalogue.service';
import { CatalogueItemDto } from './dto/CatalogueItemDto';
import { ApiBody, ApiOkResponse, ApiResponse, ApiResponseProperty, ApiTags } from '@nestjs/swagger';
import { CatalogueItemPageDto } from './dto/CatalogueItemPageDto';

@ApiTags('Public')
@Controller({
  path: 'catalogue',
  version: '1'
})
export class CatalogueController {
  private readonly logger = new Logger(CatalogueController.name);
  constructor(private readonly appService: CatalogueService) { }

  @Get('listings/:page')
  @ApiOkResponse({
    type: CatalogueItemPageDto,
    isArray: true,
    description: 'Available catalogue items'
  })
  async getCatalogueItems(@Param('page', ParseIntPipe) page: number): Promise<CatalogueItemPageDto> {
    if (page < 0) {
      throw new BadRequestException('Page number cannot be negative');
    }
    this.logger.log(`Requesting catalogue items of page ${page}`);
    const result = await this.appService.getItems(page);
    return result;
  }

  @Post('listings/add')
  @ApiOkResponse({
    type: Number,
    isArray: false,
    description: 'Inserted count'
  })
  @ApiBody({type: CatalogueItemDto, isArray: true})
  async insertCatalogueItems(@Body(new ParseArrayPipe({items: CatalogueItemDto})) items:CatalogueItemDto[]): Promise<Number> {
    const result = await this.appService.insertItems(items);
    return result;
  }

}
