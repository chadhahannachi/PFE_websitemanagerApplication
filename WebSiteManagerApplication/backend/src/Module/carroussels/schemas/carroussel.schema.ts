import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Contenu } from 'src/Module/contenus/schemas/contenu.schema';
import { Entreprise } from 'src/Module/entreprise/schemas/entreprise.schema';


export type CarrousselDocument = Carroussel & Document;

@Schema()
export class Carroussel extends Document {
  
  @Prop({ required: true })
  titre: string;

  @Prop()
  police: string;

  @Prop()
  code: string;

  @Prop()
  position: string;

  @Prop({ type: Object, default: {} })
  styles: object; // Cela peut contenir des propriétés CSS personnalisées

  @Prop({ type: Object, default: {} })
  elementStyles: object; // Cela peut contenir des propriétés CSS personnalisées

  @Prop()
  url: string;

  @Prop()
  isArchived: boolean;

  // @Prop({ type: Types.ObjectId, ref: 'Contenu' })
  // contenu: Contenu;

  // @Prop({ type: [{ type: Types.ObjectId, ref: 'Contenu' }] }) 
  // contenus: Contenu[]; // Référence un ou plusieurs contenus dynamiques

  @Prop({ type: Types.ObjectId, ref: 'Entreprise'})
    entreprise: Entreprise;
    

}

export const CarrousselSchema = SchemaFactory.createForClass(Carroussel);

