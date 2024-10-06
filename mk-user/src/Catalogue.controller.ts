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
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CatalogueItemPageDto } from './dto/CatalogueItemPage.dto';
import { RcpExceptionFilter } from './exceptions/RpcExceptionFilter';
import { CreateCatalogueItemDto } from './dto/CreateCatalogueItem.dto';
import { CatalogueItemDto } from './dto/CatalogueItem.dto';
import { ObjectIdValidationPipe } from './pipes/ObjectIdValidation.pipe';
import OpenApiTags from './enums/OpenApiTags';

@ApiTags(OpenApiTags.CATALOGUE)
@Controller({
  path: 'catalogue',
  version: '1',
})
export class CatalogueController {
  private readonly logger = new Logger(CatalogueController.name);
  constructor(private readonly catalogueService: CatalogueService) {}

  @Get()
  @ApiOperation({
    summary: 'Returns the catalogue items available',
  })
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

  @Get(':id')
  @ApiOperation({
    summary: 'Find the specified item using its ID',
  })
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

  @Post()
  @ApiOperation({
    summary: 'Add new catalogue items',
  })
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
