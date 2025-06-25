import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Entreprise } from 'src/Module/entreprise/schemas/entreprise.schema';
import { Column } from 'typeorm';

export type PreferenceDocument = Preference & Document;

@Schema()
export class Preference extends Document {
  
  // @Prop({ type: Object, default: {} })
  // preferences: Record<string, number>;

  @Prop({ type: Object, default: {} })
  preferences: Record<string, any>;

  @Prop({ type: Types.ObjectId, ref: 'Entreprise'})
  entreprise: Entreprise;
}

export const PreferenceSchema = SchemaFactory.createForClass(Preference);
 