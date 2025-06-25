import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Language, LanguageSchema } from './schemas/language.schema';
import { LanguageController } from './language.controller';
import { LanguageService } from './language.service';


@Module({
  imports: [MongooseModule.forFeature([{ name: Language.name, schema: LanguageSchema }])],
  controllers: [LanguageController],
  providers: [LanguageService],
  exports: [LanguageService],
})
export class LanguageModule {}
