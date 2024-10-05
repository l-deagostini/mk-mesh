import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  UseFilters,
} from '@nestjs/common';
import { CatalogueService } from './Catalogue.service';
import { CatalogueItemDto } from './dto/CatalogueItemDto';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CatalogueItemPageDto } from './dto/CatalogueItemPageDto';
import { RcpExceptionFilter } from './exceptions/RpcExceptionFilter';

@ApiTags('Public')
@Controller({
  path: 'catalogue',
  version: '1',
})
export class CatalogueController {
  private readonly logger = new Logger(CatalogueController.name);
  constructor(private readonly catalogueService: CatalogueService) {}

  @Get('listings/:page')
  @ApiOkResponse({
    type: CatalogueItemPageDto,
    isArray: true,
    description: 'Available catalogue items',
  })
  @UseFilters(new RcpExceptionFilter())
  async getCatalogueItems(
    @Param('page', ParseIntPipe) page: number,
  ): Promise<CatalogueItemPageDto> {
    if (page < 0) {
      throw new BadRequestException('Page number cannot be negative');
    }
    this.logger.debug(`Forwarding request to service... (page:${page})`);
    const result = await this.catalogueService.getItems(page);
    this.logger.verbose(
      `Catalogue items: page ${result.currentPage}/${result.totalPages} with ${result.length} elements`,
    );
    return result;
  }

  @Post('listings/add')
  @ApiOkResponse({
    type: Number,
    isArray: false,
    description: 'Inserted count',
  })
  @ApiBody({ type: CatalogueItemDto, isArray: true })
  @UseFilters(new RcpExceptionFilter())
  async insertCatalogueItems(
    @Body(new ParseArrayPipe({ items: CatalogueItemDto }))
    items: CatalogueItemDto[],
  ): Promise<number> {
    const result = await this.catalogueService.insertItems(items);
    return result;
  }
}
