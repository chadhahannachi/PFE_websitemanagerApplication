import { Module } from '@nestjs/common';
import { EntrepriseModule } from '../entreprise/entreprise.module';
import { ContenuModule } from '../contenus/contenus.module';
import { PreferenceModule } from '../preferences/preferences.module';
import { CouleurModule } from '../couleurs/couleurs.module';
import { PageModule } from '../Pages/pages.module';
import { MenuModule } from '../menus/menus.module';
import { NavbarModule } from '../navbars/navbars.module';
import { CookieModule } from '../cookies/cookies.module';
import { FormulaireModule } from '../forms/forms.module';
import { SlideModule } from '../Slides/slides.module';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';

@Module({
  imports: [
    EntrepriseModule,
    ContenuModule, // <-- assure l'accès à GeminiService
    PreferenceModule,
    CouleurModule,
    PageModule,
    MenuModule,
    NavbarModule,
    CookieModule,
    FormulaireModule,
    SlideModule,
  ],
  controllers: [ChatbotController],
  providers: [ChatbotService],
  exports: [ChatbotService],
})
export class ChatbotModule {} 