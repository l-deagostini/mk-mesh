import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { HydratedDocument } from 'mongoose';
import OrderStatus from 'src/enums/OrderStatus';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ _id: false })
export class OrderItem {
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

@Schema({ collection: 'orders', timestamps: true })
export class Order {
  @IsNotEmpty()
  @IsString()
  @Prop({
    required: true,
    type: String,
  })
  userId: string;

  @Prop({ type: [OrderItem], default: [] })
  items: OrderItem[];

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

  @IsEnum(OrderStatus)
  @Prop({
    required: true,
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.pre('save', function (next) {
  const order = this as Order;
  order.items = order.items.filter((item) => item.quantity > 0);
  order.items.forEach((item) => {
    item.total = item.price * item.quantity;
  });
  order.totalPrice = order.items.reduce((acc, item) => acc + item.total, 0);
  order.totalItems = order.items.reduce((acc, item) => acc + item.quantity, 0);
  next();
});
