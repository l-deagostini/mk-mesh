import { Controller, Get } from '@nestjs/common';
import { BasketService } from './basket.service';
import { firstValueFrom, lastValueFrom} from 'rxjs';

@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) { }

  @Get()
  async helloWorld() {
    const result = await firstValueFrom(this.basketService.catClient.send('items', []))
    console.log(result);
    return result || 'nothing';
  }
}
