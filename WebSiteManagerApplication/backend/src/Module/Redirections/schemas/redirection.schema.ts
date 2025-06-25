import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RedirectionDocument = Redirection & Document;

@Schema()
export class Redirection extends Document {
  
  @Prop({ required: true })
  urlSource: string;
 
  @Prop({required: true})
  urlCible: string;

  
}

export const RedirectionSchema = SchemaFactory.createForClass(Redirection);
 
