import { Catch, Inject, Injectable, Logger, UseFilters } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CatalogueItemDto } from './dto/CatalogueItemDto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { isArray, isNumber, validate } from 'class-validator';
import { error } from 'console';
import { firstValueFrom } from 'rxjs';
import { CatalogueItemPageDto } from './dto/CatalogueItemPageDto';
import { RmqCatalogueCommands } from './enums/RmqCommands';
import { RcpExceptionFilter } from './exceptions/RpcExceptionFilter';
import ServiceNames from './enums/ServiceNames';

@Injectable()
export class CatalogueService {
  private readonly logger = new Logger(CatalogueService.name);
  constructor(@Inject(ServiceNames.CATALOGUE_SERVICE) public catalogueClient:ClientProxy){
  }

  async getItems(page:Number): Promise<CatalogueItemPageDto> {
    const result = await firstValueFrom(this.catalogueClient.send(RmqCatalogueCommands.GET_ITEMS, {page:page}));
    const dto = await this.toCatalogueItemPageDto(result);
    return dto;
  }

  async insertItems(items:CatalogueItemDto[]): Promise<Number> {
    const result = await firstValueFrom(this.catalogueClient.send(RmqCatalogueCommands.INSERT_ITEMS, {items: items}));
    if(result && isNumber(result)){
      return result;
    }
  }

  private async toCatalogueItemPageDto(data:any) : Promise<CatalogueItemPageDto> {
    const dto = plainToClass(CatalogueItemPageDto, data);
    const errors = await validate(dto);
    if(error.length > 0){
      this.logger.error('Validation error while fetching catalogue items');
      throw new Error(`Validation failed: ${errors}`);
    }
    return dto;
}

  private async toCatalogueItemDto(data:any) : Promise<CatalogueItemDto[]> {
      const dto = plainToClass(CatalogueItemDto, data);
      const errors = await validate(dto);
      if(error.length > 0){
        this.logger.error('Validation error while fetching catalogue items');
        throw new Error(`Validation failed: ${errors}`);
      }
      return isArray(dto) ? dto : [dto];
  }
}
