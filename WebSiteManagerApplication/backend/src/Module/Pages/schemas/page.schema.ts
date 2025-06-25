import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Entreprise } from 'src/Module/entreprise/schemas/entreprise.schema';

export type PageDocument = Page & Document;

@Schema()
export class Page extends Document {
  
  
  @Prop()
  titre: string;

  @Prop()
  url: string;
 
  @Prop()
  isArchived: boolean;
  
  @Prop({ type: Types.ObjectId, ref: 'Entreprise' })
  entreprise: Entreprise;

  @Prop([
    {
      type: {
        contenuId: { type: Types.ObjectId, required: true }, // référence vers une collection spécifique
        type: { type: String, required: true }, // 'faq', 'service', 'temoignage', etc.
        ordre: { type: Number, default: 0 },    // position dans la page
        style: { type: Object },                // styles personnalisés (optionnel)
      },
    },
  ])
  sections: {
    contenuId: Types.ObjectId;
    type: string;
    ordre: number;
    style?: Record<string, any>;
  }[];

  
}

export const PageSchema = SchemaFactory.createForClass(Page);
 