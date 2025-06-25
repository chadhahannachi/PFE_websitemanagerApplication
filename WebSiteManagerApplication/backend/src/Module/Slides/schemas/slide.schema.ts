import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Entreprise } from 'src/Module/entreprise/schemas/entreprise.schema';

export type SlideDocument = Slide & Document;

@Schema()
export class Slide extends Document {
  
  @Prop()
  titre: string;

  @Prop()
  description: string;
 
  @Prop()
  image: string;

  @Prop({ type: Object, default: {} })
  styles: object; 

  @Prop()
  position: string;

  @Prop()
  url: string;

  @Prop()
  isArchived: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Entreprise'})
  entreprise: Entreprise;
}

export const SlideSchema = SchemaFactory.createForClass(Slide);
 