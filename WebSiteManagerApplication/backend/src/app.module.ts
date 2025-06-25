import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerConfigModule } from './auth/mailer.module';
import { EntrepriseModule } from './Module/entreprise/entreprise.module';
import { PageModule } from './Module/Pages/pages.module';
import { RedirectionModule } from './Module/Redirections/redirections.module';
import { SlideModule } from './Module/Slides/slides.module';
import { ContenuModule } from './Module/contenus/contenus.module';
import { CarrousselModule } from './Module/carroussels/carroussels.module';
import { NavbarModule } from './Module/navbars/navbars.module';
import { MenuModule } from './Module/menus/menus.module';
import { FormulaireModule } from './Module/forms/forms.module';
import { LanguageModule } from './Module/language/language.module';
import { KeywordModule } from './Module/referencementSEO/keywords.module';
import { CookieModule } from './Module/cookies/cookies.module';
import { LayoutModule } from './Module/layouts/layout.module';
import { WebsiteModule } from './Website/websites.module';
import { PreferenceModule } from './Module/preferences/preferences.module';
import { CouleurModule } from './Module/couleurs/couleurs.module';
import { LicenseModule } from './Module/License/license.module';
import { StripeModule } from './Module/stripe/stripe.module';
import { PaymentModule } from './Module/payment/payment.module';
import { NotificationModule } from './Module/notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    AuthModule,
    MailerConfigModule,
    EntrepriseModule,
    PageModule,
    RedirectionModule,
    SlideModule,
    ContenuModule,
    CarrousselModule,
    NavbarModule,
    MenuModule,
    FormulaireModule,
    LanguageModule,
    KeywordModule,
    CookieModule,
    LayoutModule,
    WebsiteModule,
    PreferenceModule,
    CouleurModule,
    LicenseModule,
    StripeModule,
    PaymentModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
