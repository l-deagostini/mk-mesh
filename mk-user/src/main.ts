import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';
import OpenApiTags from './enums/OpenApiTags';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
  });
  const apiConfig = new DocumentBuilder()
    .setTitle('MK-User')
    .setDescription(
      'REST API to simulate what the frontend would be requesting. Acts as an API gateway.',
    )
    .setVersion('1.0');
  for (const value of Object.values(OpenApiTags)) {
    apiConfig.addTag(value);
  }
  const document = SwaggerModule.createDocument(app, apiConfig.build());
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();
