import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Preference, PreferenceSchema } from './schemas/preference.schema';
import { PreferenceController } from './preferences.controller';
import { PreferenceService } from './preferences.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Preference.name, schema: PreferenceSchema }])],
  controllers: [PreferenceController],
  providers: [PreferenceService],
  exports: [PreferenceService],
})
export class PreferenceModule {}
