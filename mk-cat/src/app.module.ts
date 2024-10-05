import { Module } from '@nestjs/common';
import { CatalogueController } from './Catalogue.controller';
import { CatalogueService } from './Catalogue.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CatalogueItem,
  CatalogueItemSchema,
} from './schemas/CatalogueItem.schema';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import ConnectionNames from './enums/ConnectionNames';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        // Application
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('production'),
        APP_NAME: Joi.string().default('mkcat'),
        PAGE_SIZE: Joi.number().positive().integer().max(100).default(5),

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
        RABBITMQ_CATALOGUE_QUEUE: Joi.string().default('cat_queue'),

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
        connectionName: ConnectionNames.CATALOGUE,
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
      [{ name: CatalogueItem.name, schema: CatalogueItemSchema }],
      ConnectionNames.CATALOGUE,
    ),
  ],
  controllers: [CatalogueController],
  providers: [CatalogueService],
})
export class AppModule {}
