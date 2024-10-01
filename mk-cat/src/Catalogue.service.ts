import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { CatalogueItem, CatalogueItemDocument, CatalogueItemSchema } from './schemas/CatalogueItem.schema';

@Injectable()
export class CatalogueService {
  constructor(
    @InjectConnection('catalogue') private connection: Connection
  ) { }
  private readonly logger = new Logger(CatalogueService.name);

  async getItems(limit = 1, skip = 0): Promise<CatalogueItemDocument[]> {
    this.logger.log(`Retrieving limit: ${limit} and skipping ${skip}`);
    const result = await this.connection.collection(CatalogueItemSchema.get('collection'))
      .find<CatalogueItemDocument>({}, {
        limit: limit, skip: skip
      }).toArray();
    this.logger.log(`Retrieved ${result.length} items`);
    return result;
  }

  async countItems(): Promise<number> {
    const result = await this.connection.collection(CatalogueItemSchema.get('collection'))
      .estimatedDocumentCount();
    this.logger.log(`Estimated ${result} catalogue items in collection`);
    return result;
  }

  async insertItems(item:CatalogueItem[]): Promise<Number> {
    this.logger.log(`Inserting: ${item.length} items`);
    const result = await this.connection.collection(CatalogueItemSchema.get('collection'))
      .insertMany(item);
    this.logger.log(`Inserted ${result.insertedCount} items`);
    return result.insertedCount;
  }
}
