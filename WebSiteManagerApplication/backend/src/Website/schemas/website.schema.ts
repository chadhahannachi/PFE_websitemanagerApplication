import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Website extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  html: string;

  @Prop()
  css: string;

  @Prop({ required: true })
  userId: string;
}

export const WebsiteSchema = SchemaFactory.createForClass(Website);
