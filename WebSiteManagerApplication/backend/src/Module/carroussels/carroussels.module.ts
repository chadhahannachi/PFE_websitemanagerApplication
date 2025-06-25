import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Carroussel, CarrousselSchema } from './schemas/carroussel.schema';
import { CarrousselController } from './carroussels.controller';
import { CarrousselService } from './carroussels.service';
import { Contenu, ContenuSchema } from '../contenus/schemas/contenu.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Carroussel.name, schema: CarrousselSchema },
    { name: Contenu.name, schema: ContenuSchema }
  ])],
  controllers: [CarrousselController],
  providers: [CarrousselService],
  exports: [CarrousselService],
})
export class CarrousselModule {}
