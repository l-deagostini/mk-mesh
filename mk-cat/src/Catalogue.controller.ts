import { Controller, Logger, ParseArrayPipe, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CatalogueService } from './Catalogue.service';
import {
  CatalogueItem,
  CatalogueItemDocument,
} from './schemas/CatalogueItem.schema';
import { PageDto } from './dto/PageDto';
import { DataValidationExceptionFilter } from './exceptions/DataValidationExceptionFilter';
import { ConfigService } from '@nestjs/config';
import { RmqCatalogueCommands } from './shared/RmqCommands';

@Controller()
export class CatalogueController {
  private readonly logger = new Logger(CatalogueController.name);
  private readonly PAGE_SIZE = this.configService.get<number>('PAGE_SIZE');

  constructor(
    private configService: ConfigService,
    private readonly catService: CatalogueService,
  ) {
    this.logger.debug(`Max page size set to ${this.PAGE_SIZE}`);
  }

  @MessagePattern(RmqCatalogueCommands.GET_ITEMS)
  async getItems(
    @Payload('page') page = 1,
  ): Promise<PageDto<CatalogueItemDocument>> {
    this.logger.debug(`Getting items for page ${page}`);
    page = page < 1 ? 1 : page;
    const documentCount = await this.catService.countItems();
    const limit = this.PAGE_SIZE;
    const skip = (page - 1) * limit;
    const data = await this.catService.getItems(limit, skip);
    return {
      currentPage: page,
      totalPages: Math.ceil(documentCount / this.PAGE_SIZE),
      data: data,
      length: data.length,
    };
  }

  @MessagePattern(RmqCatalogueCommands.GET_ITEM)
  @UseFilters(new DataValidationExceptionFilter())
  async getItem(
    @Payload('id')
    id: string,
  ): Promise<CatalogueItemDocument> {
    this.logger.debug(`Getting item with id ${id}`);
    const result = await this.catService.getItemById(id);
    return result;
  }

  @MessagePattern(RmqCatalogueCommands.INSERT_ITEMS)
  @UseFilters(new DataValidationExceptionFilter())
  async insertItems(
    @Payload('items', new ParseArrayPipe({ items: CatalogueItem }))
    data: CatalogueItem[],
  ): Promise<number> {
    this.logger.debug(`Preparing to insert ${data.length} items`);
    const result = await this.catService.insertItems(data);
    return result;
  }
}
