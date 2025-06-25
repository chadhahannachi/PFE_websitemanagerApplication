import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { ContenuService } from './contenus.service';
import { CreateContenuDto } from './dto/create-contenu.dto';
import { UpdateContenuDto } from './dto/update-contenu.dto';
import { GenerateContenuDto } from './dto/generate-contenu.dto';

@Controller('contenus')
export class ContenuController {
  private readonly logger = new Logger(ContenuController.name);

  constructor(private readonly contenuService: ContenuService) {}

  @Post(':type')
  create(@Param('type') type: string, @Body() createContenuDto: CreateContenuDto) {
    return this.contenuService.create(createContenuDto, type);
  }

  @Get(':type')
  findAll(@Param('type') type: string) {
    return this.contenuService.findAll(type);
  }

  @Get(':type/:id')
  findOne(@Param('type') type: string, @Param('id') id: string) {
    return this.contenuService.findOne(id, type);
  }

  @Patch(':type/:id')
  update(@Param('type') type: string, @Param('id') id: string, @Body() updateContenuDto: UpdateContenuDto) {
    return this.contenuService.update(id, updateContenuDto, type);
  }

  @Delete(':type/:id')
  remove(@Param('type') type: string, @Param('id') id: string) {
    return this.contenuService.remove(id, type);
  }


  // @Get(':type/entreprise/:entrepriseId')
  // async getContenuByEntreprise(@Param('type') type: string, @Param('entrepriseId') entrepriseId: string): Promise<any[]> {
  //   return this.contenuService.findContenuByEntreprise(type, entrepriseId);
  // }

  @Get(':type/entreprise/:entrepriseId')
  async getContenuByEntreprise(
    @Param('type') type: string,
    @Param('entrepriseId') entrepriseId: string,
  ): Promise<any[]> {
    return this.contenuService.findContenuByEntreprise(type, entrepriseId);
  }




  @Patch('FAQ/:id/styles')
  updateFaqStyles(@Param('id') id: string, @Body() styles: Record<string, any>) {
    return this.contenuService.updateFaqStyles(id, styles);
  }


  @Patch('Unite/:id/styles')
  updateUniteStyles(@Param('id') id: string, @Body() styles: Record<string, any>) {
    return this.contenuService.updateUniteStyles(id, styles);
  }

  @Patch('Service/:id/styles')
  updateServiceStyles(@Param('id') id: string, @Body() styles: Record<string, any>) {
    return this.contenuService.updateServiceStyles(id, styles);
  }

  @Patch('Solution/:id/styles')
  updateSolutionStyles(@Param('id') id: string, @Body() styles: Record<string, any>) {
    return this.contenuService.updateSolutionStyles(id, styles);
  }

  @Patch('Evenement/:id/styles')
  updateEvenementStyles(@Param('id') id: string, @Body() styles: Record<string, any>) {
    return this.contenuService.updateEvenementStyles(id, styles);
  }

  @Post('generate/:entrepriseId')
  async generateContent(
    @Param('entrepriseId') entrepriseId: string,
    @Body() generateDto: GenerateContenuDto
  ) {
    try {
      this.logger.log(`Generating content for entreprise ${entrepriseId}`);
      this.logger.debug('Generate DTO received:', generateDto);
      
      const content = await this.contenuService.generateContent(entrepriseId, generateDto);
      this.logger.debug('Generated content saved:', content);
      
      return content;
    } catch (error) {
      this.logger.error('Error generating content:', error);
      this.logger.error('Error stack:', error.stack);
      throw error;
    }
  }
  
}
