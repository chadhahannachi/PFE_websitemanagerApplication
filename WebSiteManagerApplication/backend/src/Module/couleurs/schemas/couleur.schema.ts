import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Entreprise } from 'src/Module/entreprise/schemas/entreprise.schema';

export type CouleurDocument = Couleur & Document;

@Schema()
export class Couleur extends Document {
  
  @Prop()
  couleur: string;

  @Prop({ type: Types.ObjectId, ref: 'Entreprise' })
  entreprise: Entreprise;
}

export const CouleurSchema = SchemaFactory.createForClass(Couleur);
 