import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { HydratedDocument } from "mongoose";

export type CatalogueItemDocument = HydratedDocument<CatalogueItem>;

@Schema({collection: 'items'})
export class CatalogueItem {
    @IsNotEmpty()
    @IsString()
    @Prop({
        required: true,
        type: String
    })
    name: string;

    @IsOptional()
    @IsString()
    @Prop({
        type: String
    })
    description: string;

    @IsNumber()
    @IsNotEmpty()
    @Prop({
        required: true,
        type: Number
    })
    price: Number;
}

export const CatalogueItemSchema = SchemaFactory.createForClass(CatalogueItem);
