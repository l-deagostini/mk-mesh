import { Module } from '@nestjs/common';
import { CatalogueController } from './Catalogue.controller';
import { CatalogueService } from './Catalogue.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CATALOGUE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@localhost:5672'],
          queue: 'cat_queue',
          queueOptions: {
            durable: false,
          }
        }
      }
    ])
  ],
  controllers: [CatalogueController],
  providers: [CatalogueService],
})
export class AppModule {}
