import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Entreprise } from 'src/Module/entreprise/schemas/entreprise.schema';

export type CookieDocument = Cookie & Document;

@Schema()
export class Cookie extends Document {

  @Prop()
  preferences: string;

  @Prop()
  dateaccept: string;

  @Prop()
  dureedevie: string;

  @Prop()
  typecookies: string;

  @Prop({ type: Types.ObjectId, ref: 'Entreprise' })
  entreprise: Entreprise;

}

export const CookieSchema = SchemaFactory.createForClass(Cookie);
 