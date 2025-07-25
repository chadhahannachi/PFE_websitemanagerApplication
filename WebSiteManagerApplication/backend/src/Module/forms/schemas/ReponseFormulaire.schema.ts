import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { Formulaire } from './formulaire.schema';

export type InputChampDocument = HydratedDocument<ReponseFormulaire>;

@Schema()
export class ReponseFormulaire {

  @Prop({ type: Object, default: {} })
  values: Record<string, any>;

  @Prop({ type: Types.ObjectId, ref: 'Formulaire' })
  formulaire: Formulaire;
  
}

export const ReponseFormulaireSchema = SchemaFactory.createForClass(ReponseFormulaire);
