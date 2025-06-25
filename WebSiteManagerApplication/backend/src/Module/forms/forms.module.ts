import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Formulaire, FormulaireSchema } from './schemas/formulaire.schema';
import { Champ, ChampSchema } from './schemas/champ.schema';
import { InputChamp, InputChampSchema } from './schemas/inputChamp.schema';
import { FormulaireService } from './forms.service';
import { FormulaireController } from './forms.controller';


@Module({
  imports: [MongooseModule.forFeature([{ name: Formulaire.name, schema: FormulaireSchema },
    { name: Champ.name, schema: ChampSchema },
    { name: InputChamp.name, schema: InputChampSchema }

  ])],
  controllers: [FormulaireController],
  providers: [FormulaireService],
  exports: [FormulaireService],
})
export class FormulaireModule {}
