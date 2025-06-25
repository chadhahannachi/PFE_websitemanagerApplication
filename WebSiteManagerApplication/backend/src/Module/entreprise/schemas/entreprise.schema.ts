import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EntrepriseDocument = Entreprise & Document;

@Schema()
export class Entreprise extends Document {
  
  @Prop({ required: true })
  nom: string;
 
  @Prop({required: true})
  contact: string;

  @Prop({required: true})
  numTel: string;

  @Prop({required: true})
  adresse: string;

  @Prop()
  idRequestLicence: string;

  @Prop({required: true})
  raisonSociale: string;
  
}

export const EntrepriseSchema = SchemaFactory.createForClass(Entreprise);
 
