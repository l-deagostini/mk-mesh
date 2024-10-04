import { Module } from '@nestjs/common';
import { CatalogueController } from './Catalogue.controller';
import { CatalogueService } from './Catalogue.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import ServiceNames from './enums/ServiceNames';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ServiceNames.CATALOGUE_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_ADDRESS}:${process.env.RABBITMQ_PORT}`],
          queue: process.env.CATALOGUE_QUEUE,
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
