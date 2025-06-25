import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Layout extends Document {
  @Prop({ type: [{ id: Number, type: String }] })
  sections: { id: number; type: string }[];
}

export const LayoutSchema = SchemaFactory.createForClass(Layout);
