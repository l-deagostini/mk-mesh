import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CatalogueController } from './Catalogue.controller';
import { CatalogueService } from './Catalogue.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import ServiceNames from './enums/ServiceNames';
import { RequestMiddleware } from './middleware/RequestMiddleware';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { BasketController } from './Basket.controller';
import { BasketService } from './Basket.service';
import { OrderController } from './Order.controller';
import { OrderService } from './Order.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        REQUEST_TIMEOUT: Joi.number().positive().integer().default(5000),

        RABBITMQ_USER: Joi.string().required(),
        RABBITMQ_PASS: Joi.string().required(),
        RABBITMQ_ADDRESS: Joi.string().required(),
        RABBITMQ_PORT: Joi.number().port().default(5672),
        RABBITMQ_CATALOGUE_QUEUE: Joi.string().default('cat_queue'),
        RABBITMQ_BASKET_QUEUE: Joi.string().default('basket_queue'),
        RABBITMQ_ORDER_QUEUE: Joi.string().default('order_queue'),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: ServiceNames.CATALOGUE_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_ADDRESS}:${process.env.RABBITMQ_PORT}`,
          ],
          queue: process.env.RABBITMQ_CATALOGUE_QUEUE,
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: ServiceNames.BASKET_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_ADDRESS}:${process.env.RABBITMQ_PORT}`,
          ],
          queue: process.env.RABBITMQ_BASKET_QUEUE,
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: ServiceNames.ORDER_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_ADDRESS}:${process.env.RABBITMQ_PORT}`,
          ],
          queue: process.env.RABBITMQ_ORDER_QUEUE,
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [CatalogueController, BasketController, OrderController],
  providers: [CatalogueService, BasketService, OrderService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestMiddleware).forRoutes('*');
  }
}
