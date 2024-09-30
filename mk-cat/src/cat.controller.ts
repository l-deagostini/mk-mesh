import { Controller, Get, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CatService } from './cat.service';
import { CatalogueItemDocument } from './schemas/CatalogueItem.schema';

@Controller()
export class CatController {
  constructor(private readonly catService: CatService) {}
  private readonly logger = new Logger(CatController.name);

  @MessagePattern('sum')
  accumulate(data: number[]): number {
    const result =  (data || []).reduce((a, b) => a + b);
    this.logger.log(`Sum: ${data} = ${result}`)
    return result;
  }

  @MessagePattern('items')
  async item(): Promise<CatalogueItemDocument[]> {
    return this.catService.getItems();
  }
}
