import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ContenuController } from './contenus.controller';
import { ContenuService } from './contenus.service';
import { GeminiService } from './services/gemini.service';
import { Actualite, ActualiteSchema, APropos, AProposSchema, ContactUs, ContactUsSchema, Contenu, ContenuSchema, ContenuSpecifique, ContenuSpecifiqueSchema, Evenement, EvenementSchema, FAQ, FAQSchema, Partenaire, PartenaireSchema, Service, ServiceSchema, Solution, SolutionSchema, Temoignage, TemoignageSchema, Unite, UniteSchema } from './schemas/contenu.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Contenu.name, schema: ContenuSchema },
    { name: ContenuSpecifique.name, schema: ContenuSpecifiqueSchema },
    { name: Partenaire.name, schema: PartenaireSchema },
    { name: Temoignage.name, schema: TemoignageSchema },
    { name: FAQ.name, schema: FAQSchema },
    { name: Evenement.name, schema: EvenementSchema },
    { name: APropos.name, schema: AProposSchema },
    // { name: Article.name, schema: ArticleSchema },
    { name: Actualite.name, schema: ActualiteSchema },
    { name: Service.name, schema: ServiceSchema },
    { name: Solution.name, schema: SolutionSchema },
    { name: Unite.name, schema: UniteSchema },
    { name: ContactUs.name, schema: ContactUsSchema },

  ]),],
  controllers: [ContenuController],
  providers: [ContenuService, GeminiService],
  exports: [ContenuService,GeminiService],
})
export class ContenuModule {}
