import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateCouleurDto } from './dto/create-couleur.dto';
import { UpdateCouleurDto } from './dto/update-couleur.dto';
import { CouleurService } from './couleurs.service';
import { Couleur } from './schemas/couleur.schema';

@Controller('couleurs')
export class CouleurController {
  constructor(private readonly couleurService: CouleurService) {}

  @Post()
  create(@Body() createCouleurDto: CreateCouleurDto) {
    return this.couleurService.create(createCouleurDto);
  }

  @Get()
  findAll() {
    return this.couleurService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.couleurService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCouleurDto: UpdateCouleurDto) {
    return this.couleurService.update(id, updateCouleurDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.couleurService.remove(id);
  }

  @Get('/entreprise/:entrepriseId/couleurs')
      async getCouleursByEntreprise(@Param('entrepriseId') entrepriseId: string): Promise<Couleur[]> {
          return this.couleurService.findCouleurByEntreprise(entrepriseId);
      }
}
