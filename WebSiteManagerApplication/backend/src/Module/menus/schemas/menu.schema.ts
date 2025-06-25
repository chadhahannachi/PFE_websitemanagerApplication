import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Redirection } from 'src/Module/Redirections/schemas/redirection.schema';


export type MenuDocument = Menu & Document;

@Schema()
export class Menu extends Document {

  @Prop()
  text: string;

  @Prop()
  position: string;

  @Prop()
  taille: string;

  @Prop()
  police: string;

  @Prop({ type: Types.ObjectId, ref: 'Redirection' })
  redirection: Redirection;
}

export const MenuSchema = SchemaFactory.createForClass(Menu);