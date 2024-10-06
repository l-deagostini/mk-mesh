import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CatalogueItemDto } from './dto/CatalogueItemDto';
import { plainToClass } from 'class-transformer';
import { isArray, isNumber, validate } from 'class-validator';
import { error } from 'console';
import { firstValueFrom, timeout } from 'rxjs';
import { CatalogueItemPageDto } from './dto/CatalogueItemPageDto';
import ServiceNames from './enums/ServiceNames';
import { ConfigService } from '@nestjs/config';
import { RmqCatalogueCommands } from './shared/RmqCommands';
import {
  GetItemPayload,
  GetItemsPayload,
  InsertItemsPayload,
} from './shared/RmqPayloads';

@Injectable()
export class CatalogueService {
  private readonly logger = new Logger(CatalogueService.name);
  private readonly REQUEST_TIMEOUT: number;

  constructor(
    private configService: ConfigService,
    @Inject(ServiceNames.CATALOGUE_SERVICE) public catalogueClient: ClientProxy,
  ) {
    this.REQUEST_TIMEOUT = this.configService.get<number>('REQUEST_TIMEOUT');
    this.logger.debug(`Request timeout set to ${this.REQUEST_TIMEOUT}ms`);
  }

  async getItems(payload: GetItemsPayload): Promise<CatalogueItemPageDto> {
    this.logger.debug(
      `Requesting data from client [${RmqCatalogueCommands.GET_ITEMS}:{page:${payload.page}}]`,
    );
    const result = await firstValueFrom(
      this.catalogueClient
        .send(RmqCatalogueCommands.GET_ITEMS, payload)
        .pipe(timeout(this.REQUEST_TIMEOUT)),
    );
    const dto = await this.toCatalogueItemPageDto(result);
    this.logger.debug(`Data received [${dto.length}]`);
    return dto;
  }

  async getItem(payload: GetItemPayload): Promise<CatalogueItemDto> {
    this.logger.debug(
      `Requesting data from client [${RmqCatalogueCommands.GET_ITEM}:{id:"${payload.id}"}]`,
    );
    const result = await firstValueFrom(
      this.catalogueClient
        .send(RmqCatalogueCommands.GET_ITEM, payload)
        .pipe(timeout(this.REQUEST_TIMEOUT)),
    );
    const dto = await this.toCatalogueItemDto(result);
    this.logger.debug(`Data received [${dto.length}]`);
    return dto.at(0);
  }

  async insertItems(items: InsertItemsPayload): Promise<number> {
    const result = await firstValueFrom(
      this.catalogueClient
        .send(RmqCatalogueCommands.INSERT_ITEMS, items)
        .pipe(timeout(this.REQUEST_TIMEOUT)),
    );
    if (result && isNumber(result)) {
      return result;
    }
  }

  private async toCatalogueItemPageDto(
    data: any,
  ): Promise<CatalogueItemPageDto> {
    const dto = plainToClass(CatalogueItemPageDto, data);
    const errors = await validate(dto);
    if (error.length > 0) {
      this.logger.error('Validation error while fetching catalogue items');
      throw new Error(`Validation failed: ${errors}`);
    }
    return dto;
  }

  private async toCatalogueItemDto(data: any): Promise<CatalogueItemDto[]> {
    const dto = plainToClass(CatalogueItemDto, data);
    const errors = await validate(dto);
    if (error.length > 0) {
      this.logger.error('Validation error while fetching catalogue items');
      throw new Error(`Validation failed: ${errors}`);
    }
    return isArray(dto) ? dto : [dto];
  }
}
