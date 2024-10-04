import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, VersioningType } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI
  });
  const config = new DocumentBuilder()
  .setTitle('MK-User')
  .setDescription('REST API to simulate what the frontend would be requesting. Acts as an API gateway.')
  .setVersion('1.0')
  .addTag('Public')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(3000);
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
