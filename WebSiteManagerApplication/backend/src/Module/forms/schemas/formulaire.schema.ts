import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Champ } from './champ.schema';
import { Entreprise } from 'src/Module/entreprise/schemas/entreprise.schema';

export type FormulaireDocument = Formulaire & Document;

@Schema()
export class Formulaire extends Document {
  
  @Prop({ required: true })
  titre: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Champ' }] })
  champs: Champ[];

  @Prop({ type: Types.ObjectId, ref: 'Entreprise' })
  entreprise: Entreprise;
  
}

export const FormulaireSchema = SchemaFactory.createForClass(Formulaire);
 
