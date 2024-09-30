import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { CatalogueItem, CatalogueItemDocument, CatalogueItemSchema } from './schemas/CatalogueItem.schema';

@Injectable()
export class CatService {
  constructor(
    @InjectConnection('catalogue') private connection:Connection
  ) {}
  private readonly logger = new Logger(CatService.name);
  
  async getItems() : Promise<CatalogueItemDocument[]> {
    const result = await this.connection.collection(CatalogueItemSchema.get('collection')).find<CatalogueItemDocument>({}).toArray();
    this.logger.log(`Retrieved ${result.length} items`);
    return result;
  }
}
