import { Module } from '@nestjs/common';
import { OrderController } from './Order.controller';
import { OrderService } from './Order.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import ConnectionNames from './enums/ConnectionNames';
import { ClientsModule, Transport } from '@nestjs/microservices';
import ServiceNames from './enums/ServiceNames';
import { Order, OrderSchema } from './schemas/Order.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        // Application
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('production'),
        APP_NAME: Joi.string().default('mkorder'),

        // RabbitMQ
        RABBITMQ_USER: Joi.string().required(),
        RABBITMQ_PASS: Joi.string().required(),
        RABBITMQ_ADDRESS: Joi.alternatives()
          .try(
            Joi.string().ip({ version: ['ipv4', 'ipv6'] }),
            Joi.string().hostname(),
          )
          .required(),
        RABBITMQ_PORT: Joi.number().port().default(5672),
        RABBITMQ_BASKET_QUEUE: Joi.string().default('basket_queue'),
        RABBITMQ_ORDER_QUEUE: Joi.string().default('order_queue'),

        // MongoDB
        MONGODB_ADDRESS: Joi.alternatives()
          .try(
            Joi.string().ip({ version: ['ipv4', 'ipv6'] }),
            Joi.string().hostname(),
          )
          .required(),
        MONGODB_PORT: Joi.number().port().default(27017),
        MONGODB_DATABASE_NAME: Joi.string().required(),
        MONGODB_AUTH_SOURCE: Joi.string().required(),
        MONGODB_USER: Joi.string().required(),
        MONGODB_PASS: Joi.string().required(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGODB_ADDRESS}:${process.env.MONGODB_PORT}/`,
      {
        connectionName: ConnectionNames.ORDER,
        appName: process.env.APP_NAME,
        dbName: process.env.MONGODB_DATABASE_NAME,
        authSource: process.env.MONGODB_AUTH_SOURCE,
        auth: {
          username: process.env.MONGODB_USER,
          password: process.env.MONGODB_PASS,
        },
      },
    ),
    MongooseModule.forFeature(
      [{ name: Order.name, schema: OrderSchema }],
      ConnectionNames.ORDER,
    ),
    ClientsModule.register([
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
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class AppModule {}
