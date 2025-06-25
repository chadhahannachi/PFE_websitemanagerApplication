import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Entreprise } from 'src/Module/entreprise/schemas/entreprise.schema';

export type KeywordDocument = Keyword & Document;

@Schema()
export class Keyword extends Document {
  
  
  @Prop({ required: true })
  keyword: string;
  
  @Prop({ type: Types.ObjectId, ref: 'Entreprise' })
  entreprise: Entreprise;
  
}

export const KeywordSchema = SchemaFactory.createForClass(Keyword);
 