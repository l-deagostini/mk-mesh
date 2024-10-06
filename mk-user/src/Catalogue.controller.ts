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
  Query,
  UseFilters,
} from '@nestjs/common';
import { CatalogueService } from './Catalogue.service';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CatalogueItemPageDto } from './dto/CatalogueItemPageDto';
import { RcpExceptionFilter } from './exceptions/RpcExceptionFilter';
import { CreateCatalogueItemDto } from './dto/CreateCatalogueItemDto';
import { CatalogueItemDto } from './dto/CatalogueItemDto';
import { ObjectIdValidationPipe } from './pipes/ObjectIdValidation.pipe';

@ApiTags('Public')
@Controller({
  path: 'catalogue',
  version: '1',
})
export class CatalogueController {
  private readonly logger = new Logger(CatalogueController.name);
  constructor(private readonly catalogueService: CatalogueService) {}

  @Get('listings')
  @ApiOkResponse({
    type: CatalogueItemPageDto,
    isArray: true,
    description: 'Available catalogue items',
  })
  @UseFilters(new RcpExceptionFilter())
  async getCatalogueItems(
    @Query('page', ParseIntPipe) page: number,
  ): Promise<CatalogueItemPageDto> {
    if (page < 0) {
      throw new BadRequestException('Page number cannot be negative');
    }
    this.logger.debug(`Forwarding request to service... (page:${page})`);
    const result = await this.catalogueService.getItems({ page: page });
    this.logger.verbose(
      `Catalogue items: page ${result.currentPage}/${result.totalPages} with ${result.length} elements`,
    );
    return result;
  }

  @Get('listings/:id')
  @ApiOkResponse({
    type: CatalogueItemDto,
    isArray: true,
    description: 'Find the specified catalogue item',
  })
  @UseFilters(new RcpExceptionFilter())
  async getCatalogueItem(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<CatalogueItemDto> {
    this.logger.debug(`Forwarding request to service... (id:"${id}")`);
    const result = await this.catalogueService.getItem({ id: id });
    this.logger.verbose(`Found item: ${result?.id}`);
    return result;
  }

  @Post('listings')
  @ApiOkResponse({
    type: Number,
    isArray: false,
    description: 'Inserted count',
  })
  @ApiBody({ type: CreateCatalogueItemDto, isArray: true })
  @UseFilters(new RcpExceptionFilter())
  async insertCatalogueItems(
    @Body(new ParseArrayPipe({ items: CreateCatalogueItemDto }))
    items: CreateCatalogueItemDto[],
  ): Promise<number> {
    const result = await this.catalogueService.insertItems({ items: items });
    return result;
  }
}
