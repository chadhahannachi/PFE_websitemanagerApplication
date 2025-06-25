import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ChampDocument = HydratedDocument<Champ>;

@Schema()
export class Champ {
  @Prop({ required: true })
  nom: string;

  @Prop({ required: true })
  type: string;
}

export const ChampSchema = SchemaFactory.createForClass(Champ);
