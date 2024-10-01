import { Catch, Controller, Get, Logger, ParseArrayPipe, UseFilters, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CatalogueService } from './Catalogue.service';
import { CatalogueItem, CatalogueItemDocument } from './schemas/CatalogueItem.schema';
import { PageDto } from './dto/PageDto';
import { RmqCatalogueCommands } from './enums/RmqCommands';
import { DataValidationExceptionFilter } from './exceptions/RpcExceptionFilter';

@Controller()
export class CatalogueController {
  private readonly logger = new Logger(CatalogueController.name);
  private readonly PAGE_SIZE = 2;

  constructor(private readonly catService: CatalogueService) {}
  

  @MessagePattern(RmqCatalogueCommands.GET_ITEMS)
  async getItems(@Payload('page') page = 1): Promise<PageDto<CatalogueItemDocument>> {
    page = page < 1 ? 1 : page;
    this.logger.log(`Getting items for page ${page}`);
    const documentCount = await this.catService.countItems();
    const limit = this.PAGE_SIZE;
    const skip = (page - 1) * limit;
    const data = await this.catService.getItems(limit, skip);
    return {
      current: page,
      total: Math.ceil(documentCount / this.PAGE_SIZE),
      data: data,
    }
  }

  @MessagePattern(RmqCatalogueCommands.INSERT_ITEMS)
  @UseFilters(new DataValidationExceptionFilter())
  async insertItems(@Payload('items', new ParseArrayPipe({items: CatalogueItem})) data:CatalogueItem[]): Promise<Number> {
    this.logger.log(`Preparing to insert ${data.length} items`);
    const result = await this.catService.insertItems(data);
    return result;
  }
}
