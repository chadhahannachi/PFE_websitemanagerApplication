import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EntrepriseService } from './entreprise.service';
import { EntrepriseController } from './entreprise.controller';
import { Entreprise, EntrepriseSchema } from './schemas/entreprise.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Entreprise.name, schema: EntrepriseSchema }])],
  controllers: [EntrepriseController],
  providers: [EntrepriseService],
  exports: [EntrepriseService],
})
export class EntrepriseModule {}
