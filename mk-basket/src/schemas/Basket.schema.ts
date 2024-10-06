import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type BasketDocument = HydratedDocument<Basket>;

@Schema({ _id: false })
export class BasketItem {
  @IsString()
  @IsNotEmpty()
  @Prop({ required: true })
  id: string;
  @IsNumber()
  @IsPositive()
  @Prop({ required: true, default: 1 })
  quantity: number;
  @IsNumber()
  @IsPositive()
  @Prop({ required: true })
  price: number;
  @Prop({ default: 0 })
  total?: number;
}

@Schema({ collection: 'baskets', timestamps: true })
export class Basket {
  @IsNotEmpty()
  @IsString()
  @Prop({
    required: true,
    type: String,
  })
  userId: string;

  @Prop({ type: [BasketItem], default: [] })
  items: BasketItem[];

  @Prop({
    type: Number,
    default: 0,
  })
  totalPrice?: number;

  @Prop({
    type: Number,
    default: 0,
  })
  totalItems?: number;
}

export const BasketSchema = SchemaFactory.createForClass(Basket);

BasketSchema.pre('save', function (next) {
  const basket = this as Basket;
  basket.items = basket.items.filter((item) => item.quantity > 0);
  basket.items.forEach((item) => {
    item.total = item.price * item.quantity;
  });
  basket.totalPrice = basket.items.reduce((acc, item) => acc + item.total, 0);
  basket.totalItems = basket.items.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );
  next();
});
