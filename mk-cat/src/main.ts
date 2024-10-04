import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_ADDRESS}:${process.env.RABBITMQ_PORT}`],
      queue: process.env.CATALOGUE_QUEUE,
      noAck: true,
      queueOptions: {
        durable: false,
      }
    }
  });
  return app.listen();
}

ConfigModule.forRoot({
  validationSchema: Joi.object({ 
    RABBITMQ_USER: Joi.string().required(),
    RABBITMQ_PASS: Joi.string().required(),
    RABBITMQ_ADDRESS: Joi.string().required(),
    RABBITMQ_PORT: Joi.number().port().default(5672),
    CATALOGUE_QUEUE: Joi.string().default('cat_queue'),
  }),
  validationOptions: {
    allowUnknown: true,
    abortEarly: true,
  },
  isGlobal: true,
}),
bootstrap();
