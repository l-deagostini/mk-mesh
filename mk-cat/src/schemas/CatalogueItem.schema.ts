import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type CatalogueItemDocument = HydratedDocument<CatalogueItem>;

@Schema({collection: 'items'})
export class CatalogueItem {
    @Prop({
        required: true,
        type: String
    })
    name: string;

    @Prop({
        type: String
    })
    description: string;

    @Prop({
        required: true,
        type: Number
    })
    price: Number;
}

export const CatalogueItemSchema = SchemaFactory.createForClass(CatalogueItem);
