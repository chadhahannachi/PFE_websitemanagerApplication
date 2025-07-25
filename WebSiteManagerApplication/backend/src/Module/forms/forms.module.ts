import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Formulaire, FormulaireSchema } from './schemas/formulaire.schema';
import { Champ, ChampSchema } from './schemas/champ.schema';
import { InputChamp, InputChampSchema } from './schemas/inputChamp.schema';
import { FormulaireService } from './forms.service';
import { FormulaireController } from './forms.controller';
import { ReponseFormulaire, ReponseFormulaireSchema } from './schemas/ReponseFormulaire.schema';
import { NotificationModule } from '../notification/notification.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Formulaire.name, schema: FormulaireSchema },
      { name: ReponseFormulaire.name, schema: ReponseFormulaireSchema }
      // { name: Champ.name, schema: ChampSchema },
      // { name: InputChamp.name, schema: InputChampSchema }
    ]),
    NotificationModule,
    AuthModule
  ],
  controllers: [FormulaireController],
  providers: [FormulaireService],
  exports: [FormulaireService],
})
export class FormulaireModule {}
