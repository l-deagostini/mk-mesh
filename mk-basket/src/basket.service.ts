import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AmqpConnectionManager } from 'amqp-connection-manager';

@Injectable()
export class BasketService {
  constructor(@Inject('CAT_SERVICE') public catClient:ClientProxy){
  }

  async onApplicationBootstrap() {
    await this.catClient.connect();
    console.log('Basket Service bootstrap completed');
  }
}
