import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateCarrousselDto } from './dto/create-carroussel.dto';
import { UpdateCarrousselDto } from './dto/update-carroussel.dto';
import { CarrousselService } from './carroussels.service';
import { Carroussel } from './schemas/carroussel.schema';
import { ObjectId } from 'mongoose';

@Controller('carroussels')
export class CarrousselController {
  constructor(private readonly carrousselService: CarrousselService) {}

  @Post()
  create(@Body() createCarrousselDto: CreateCarrousselDto) {
    return this.carrousselService.create(createCarrousselDto);
  }

  // @Post()
  //   async createCarroussel(@Body() createCarrousselDto: CreateCarrousselDto) {
  //       return this.carrousselService.createCarroussel(createCarrousselDto);
  //   }

  @Get()
  findAll() {
    return this.carrousselService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carrousselService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCarrousselDto: UpdateCarrousselDto) {
    return this.carrousselService.update(id, updateCarrousselDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carrousselService.remove(id);
  }


   @Get('/entreprise/:entrepriseId/pages')
    async getCarrousselByEntreprise(@Param('entrepriseId') entrepriseId: string): Promise<Carroussel[]> {
      return this.carrousselService.findCarrousselByEntreprise(entrepriseId);
    }
  

  //   @Post(':id/contenu')
  // async ajouterContenuAuCarroussel(
  //   @Param('carrousselId') carrousselId: string, @Body('contenuId') contenuId: string ) {
  //   await this.carrousselService.addContenuToCarroussel(carrousselId, contenuId);
  //   return { message: 'Contenu ajouté au carrousel avec succès' };
  // }

  
}
