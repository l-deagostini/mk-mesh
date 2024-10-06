import { Test, TestingModule } from '@nestjs/testing';
import { BasketController } from './Basket.controller';
import { BasketService } from './Basket.service';

describe('AppController', () => {
  let appController: BasketController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BasketController],
      providers: [BasketService],
    }).compile();

    appController = app.get<BasketController>(BasketController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
