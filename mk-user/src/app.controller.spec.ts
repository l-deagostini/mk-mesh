import { Test, TestingModule } from '@nestjs/testing';
import { CatalogueController } from './Catalogue.controller';
import { CatalogueService } from './Catalogue.service';

describe('AppController', () => {
  let appController: CatalogueController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CatalogueController],
      providers: [CatalogueService],
    }).compile();

    appController = app.get<CatalogueController>(CatalogueController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getCatalogueItems()).toBe('Hello World!');
    });
  });
});
