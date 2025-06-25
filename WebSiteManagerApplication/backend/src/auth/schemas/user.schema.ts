import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { Entreprise } from 'src/Module/entreprise/schemas/entreprise.schema';
export type UserDocument = User & Document;

export enum Role {

  SuperAdminABshore = 'superadminabshore',
  SuperAdminEntreprise = 'superadminentreprise',
  Moderateur = 'moderateur',
  Visiteur = 'visiteur'
}

@Schema({
  timestamps: true,
})
export class User extends Document {

  _id : ObjectId;

  @Prop()
  nom: string;

  @Prop({ unique: [true, 'Duplicate email entered'] })
  email: string;

  @Prop()
  password: string;

  @Prop({ type: Types.ObjectId, ref: 'Entreprise', required: true })
  entreprise: Entreprise;

  @Prop()
  role: Role;

  @Prop({ required: false }) // This can be optional
  image: string;
  
}

export const UserSchema = SchemaFactory.createForClass(User);
