import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { Champ } from './champ.schema';
import { Formulaire } from './formulaire.schema';

export type InputChampDocument = HydratedDocument<InputChamp>;

@Schema()
export class InputChamp {

  @Prop({ type: Types.ObjectId, ref: 'Formulaire' })
  formulaire: Formulaire;

  @Prop({ type: Types.ObjectId, ref: 'Champ' })
  champ: Champ;

  @Prop({ required: true })
  valeur: string;
}

export const InputChampSchema = SchemaFactory.createForClass(InputChamp);
