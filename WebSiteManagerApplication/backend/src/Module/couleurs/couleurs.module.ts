import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Couleur, CouleurSchema } from './schemas/couleur.schema';
import { CouleurController } from './couleurs.controller';
import { CouleurService } from './couleurs.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Couleur.name, schema: CouleurSchema }])],
  controllers: [CouleurController],
  providers: [CouleurService],
  exports: [CouleurService],
})
export class CouleurModule {}
