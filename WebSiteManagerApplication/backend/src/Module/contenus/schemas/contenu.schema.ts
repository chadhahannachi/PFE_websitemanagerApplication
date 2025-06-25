import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Carroussel } from 'src/Module/carroussels/schemas/carroussel.schema';
import { Entreprise } from 'src/Module/entreprise/schemas/entreprise.schema';

export type ContenuDocument = Contenu & Document;
export type ContenuSpecifiqueDocument = ContenuSpecifique & Document;
export type PartenaireDocument = Partenaire & Document;
export type TemoignageDocument = Temoignage & Document;
export type FAQDocument = FAQ & Document;
export type EvenementDocument = Evenement & Document;
export type AProposDocument = APropos & Document;
// export type ArticleDocument = Article & Document;
export type ActualiteDocument = Actualite & Document;
export type ServiceDocument = Service & Document;
export type SolutionDocument = Solution & Document;
export type UniteDocument = Unite & Document;
export type ContactUsDocument = ContactUs & Document;


@Schema()
export class Contenu extends Document {
  
  @Prop()
  titre: string;

  @Prop()
  description: string;
 
  @Prop()
  image: string;

  @Prop()
  code: string;

  // @Prop({ type: Object, default: {} })
  // styles: object; 

  @Prop({ type: Object, default: {} })
  styles: Record<string, any>;

  @Prop({ type: Object, default: {} })
  positions: Record<string, any>;

  @Prop()
  datePublication: Date;

  @Prop()
  isPublished: boolean;

  @Prop()
  isArchived: boolean;

  @Prop()
  publisher: string;
 
  @Prop({ type: Types.ObjectId, ref: 'Entreprise'})
    entreprise: Entreprise;
  
  @Prop({ type: Types.ObjectId, ref: 'Carroussel'})
    carroussel: Carroussel; 
  
}

export const ContenuSchema = SchemaFactory.createForClass(Contenu);
 

@Schema()
class Variable {
  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  value: string;
}

const VariableSchema = SchemaFactory.createForClass(Variable);

//ContenuSpecifique
@Schema()
export class ContenuSpecifique extends Contenu {
  @Prop()
  layoutType: string;

  @Prop({ type: Object, default: {} })
  variables: Record<string, any>;

  @Prop({ required: true })
  html_component: string;

  @Prop({ required: true })
  css_style: string;

}
export const ContenuSpecifiqueSchema = SchemaFactory.createForClass(ContenuSpecifique);

// Partenaire
@Schema({ collection: 'partenaires' })
export class Partenaire extends Contenu {
  @Prop()
  secteurActivite: string;
}
export const PartenaireSchema = SchemaFactory.createForClass(Partenaire);

// Temoignage
@Schema()
export class Temoignage extends Contenu {
  @Prop({ required: true })
  auteur: string;
}
export const TemoignageSchema = SchemaFactory.createForClass(Temoignage);

// FAQ
@Schema()
export class FAQ extends Contenu {
  @Prop({ required: true })
  question: string;

  @Prop({ required: true })
  reponse: string;
}
export const FAQSchema = SchemaFactory.createForClass(FAQ);

// Evenement
@Schema()
export class Evenement extends Contenu {
  @Prop({ required: true })
  dateDebut: Date;

  @Prop({ required: true })
  dateFin: Date;
}
export const EvenementSchema = SchemaFactory.createForClass(Evenement);

// APropos
@Schema()
export class APropos extends Contenu {
}
export const AProposSchema = SchemaFactory.createForClass(APropos);


// Article
// @Schema()
// export class Article extends Contenu {
//   @Prop({ required: true })
//   categorie: string;

//   @Prop({ required: true })
//   prix: string;
// }
// export const ArticleSchema = SchemaFactory.createForClass(Article);


// Actualite
@Schema()
export class Actualite extends Contenu {
  
}
export const ActualiteSchema = SchemaFactory.createForClass(Actualite);

// Service
@Schema()
export class Service extends Contenu {
  
}
export const ServiceSchema = SchemaFactory.createForClass(Service);

// Solution
@Schema()
export class Solution extends Contenu {
  
}
export const SolutionSchema = SchemaFactory.createForClass(Solution);

//unite
@Schema()
export class Unite extends Contenu {
  
}
export const UniteSchema = SchemaFactory.createForClass(Unite);

@Schema()
export class ContactUs extends Contenu {
  @Prop()
  adresse: string;

  @Prop()
  phone: string;

  @Prop()
  email: string;

  @Prop({ type: Object, default: {} })
  links: Record<string, any>;
}
export const ContactUsSchema = SchemaFactory.createForClass(ContactUs);