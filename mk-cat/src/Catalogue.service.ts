import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CatalogueItem,
  CatalogueItemDocument,
} from './schemas/CatalogueItem.schema';
import ConnectionNames from './enums/ConnectionNames';

@Injectable()
export class CatalogueService {
  constructor(
    @InjectModel(CatalogueItem.name, ConnectionNames.CATALOGUE)
    private readonly catalogueModel: Model<CatalogueItemDocument>,
  ) {}
  private readonly logger = new Logger(CatalogueService.name);

  async getItems(limit = 1, skip = 0): Promise<CatalogueItemDocument[]> {
    this.logger.debug(`Retrieving limit: ${limit} and skipping ${skip}`);
    const result = await this.catalogueModel
      .find({})
      .limit(limit)
      .skip(skip)
      .exec();
    this.logger.verbose(`Retrieved ${result.length} items`);
    return result;
  }

  async getItemByName(name: string): Promise<CatalogueItemDocument> {
    this.logger.debug(`Fetching item ${name}`);
    const result = await this.catalogueModel.findOne({ name: name }).exec();
    return result;
  }

  async countItems(): Promise<number> {
    this.logger.debug(`Retrieving total document count`);
    const result = this.catalogueModel.estimatedDocumentCount().exec();
    // const result = await this.connection.collection(CatalogueItemSchema.get('collection'))
    //   .estimatedDocumentCount();
    this.logger.verbose(`Estimated ${result} catalogue items in collection`);
    return result;
  }

  async insertItems(item: CatalogueItem[]): Promise<number> {
    // this.logger.debug(`Inserting: ${item.length} items`);
    // const result = await this.connection.collection(CatalogueItemSchema.get('collection'))
    //   .insertMany(item);
    // this.logger.verbose(`Inserted ${result.insertedCount} items`);
    return 0;
  }
}
