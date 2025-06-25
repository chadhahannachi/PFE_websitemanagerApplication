import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Carroussel } from 'src/Module/carroussels/schemas/carroussel.schema';
import { Entreprise } from 'src/Module/entreprise/schemas/entreprise.schema';

export type LanguageDocument = Language & Document;

@Schema()
export class Language extends Document {
  
  @Prop()
  nom: string;

  @Prop({ type: Types.ObjectId, ref: 'Entreprise'})
  entreprise: Entreprise;
  
  
}

export const LanguageSchema = SchemaFactory.createForClass(Language);
 