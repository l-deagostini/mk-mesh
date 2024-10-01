import { Module } from '@nestjs/common';
import { CatalogueController } from './Catalogue.controller';
import { CatalogueService } from './Catalogue.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CatalogueItem, CatalogueItemSchema } from './schemas/CatalogueItem.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/', {
      connectionName: 'catalogue',
      appName: 'mkcat',
      dbName: 'catalogue',
      authSource: 'mkmesh',
      auth: {
        username: 'mkcat',
        password: 'password'
      }
    }),
    MongooseModule.forFeature([
      {name: CatalogueItem.name, schema: CatalogueItemSchema}
    ], 'catalogue')
  ],
  controllers: [CatalogueController],
  providers: [CatalogueService],
})
export class AppModule { }
