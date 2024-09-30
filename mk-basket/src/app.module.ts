import { Module } from '@nestjs/common';
import { BasketController } from './basket.controller';
import { BasketService } from './basket.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CAT_SERVICE',
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
  controllers: [BasketController],
  providers: [BasketService],
})
export class AppModule { }
