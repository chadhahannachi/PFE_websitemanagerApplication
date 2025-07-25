
// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { CreateFormulaireDto } from './dto/create-formulaire.dto';
// import { UpdateFormulaireDto } from './dto/update-formulaire.dto';
// import { Formulaire } from './schemas/formulaire.schema';
// import { FormulaireService } from './forms.service';
// import { CreateChampDto } from './dto/create-champ.dto';
// import { UpdateChampDto } from './dto/update-champ.dto';
// import { CreateInputChampDto } from './dto/create-inputChamp.dto';
// import { InputChamp } from './schemas/inputChamp.schema';

// @Controller('formulaires')
// export class FormulaireController {
//   constructor(private readonly formulaireService: FormulaireService) {}

//   @Post()
//   async create(@Body() createFormulaireDto: CreateFormulaireDto): Promise<Formulaire> {
//     return this.formulaireService.create(createFormulaireDto);
//   }

//   @Get()
//   findAll() {
//     return this.formulaireService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.formulaireService.findOne(id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateFormulaireDto: UpdateFormulaireDto) {
//     return this.formulaireService.update(id, updateFormulaireDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.formulaireService.remove(id);
//   }

//   @Get('/entreprise/:entrepriseId/formulaires')
//   async getFormulairesByEntreprise(@Param('entrepriseId') entrepriseId: string): Promise<Formulaire[]> {
//     return this.formulaireService.findFormulairesByEntreprise(entrepriseId);
//   }


//   // Gestion des champs
//   @Post('/champs')
//   async createChamp(@Body() createChampDto: CreateChampDto) {
//     return this.formulaireService.createChamp(createChampDto);
//   }

//   @Get('/champs')
//   findAllChamps() {
//     return this.formulaireService.findAllChamps();
//   }

//   @Get('/champs/:id')
//   findOneChamp(@Param('id') id: string) {
//     return this.formulaireService.findOneChamp(id);
//   }

//   @Patch('/champs/:id')
//   updateChamp(@Param('id') id: string, @Body() updateChampDto: UpdateChampDto) {
//     return this.formulaireService.updateChamp(id, updateChampDto);
//   }

//   @Delete('/champs/:id')
//   removeChamp(@Param('id') id: string) {
//     return this.formulaireService.removeChamp(id);
//   }

//   // Gestion des réponses (InputChamp)
//   @Post('/repondre')
//   async createInputChamp(@Body() createInputChampDto: CreateInputChampDto): Promise<InputChamp> {
//     return this.formulaireService.createInputChamp(createInputChampDto);
//   }

//   @Get('/reponses')
//   findAllInputChamps() {
//     return this.formulaireService.findAllInputChamps();
//   }

//   @Get('/reponses/:id')
//   findOneInputChamp(@Param('id') id: string) {
//     return this.formulaireService.findOneInputChamp(id);
//   }

//   @Delete('/reponses/:id')
//   removeInputChamp(@Param('id') id: string) {
//     return this.formulaireService.removeInputChamp(id);
//   }

// }




import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateFormulaireDto } from './dto/create-formulaire.dto';
import { UpdateFormulaireDto } from './dto/update-formulaire.dto';
import { Formulaire } from './schemas/formulaire.schema';
import { FormulaireService } from './forms.service';
import { CreateChampDto } from './dto/create-champ.dto';
import { UpdateChampDto } from './dto/update-champ.dto';
import { CreateInputChampDto } from './dto/create-inputChamp.dto';
import { InputChamp } from './schemas/inputChamp.schema';
import { ReponseFormulaire } from './schemas/ReponseFormulaire.schema';

@Controller('formulaires')
export class FormulaireController {
  constructor(private readonly formulaireService: FormulaireService) {}

  @Post()
  async create(@Body() createFormulaireDto: CreateFormulaireDto): Promise<Formulaire> {
    return this.formulaireService.create(createFormulaireDto);
  }

  @Get()
  findAll() {
    return this.formulaireService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formulaireService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFormulaireDto: UpdateFormulaireDto) {
    return this.formulaireService.update(id, updateFormulaireDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.formulaireService.remove(id);
  }

  @Get('/entreprise/:entrepriseId/formulaires')
  async getFormulairesByEntreprise(@Param('entrepriseId') entrepriseId: string): Promise<Formulaire[]> {
    return this.formulaireService.findFormulairesByEntreprise(entrepriseId);
  }


  // CRUD pour ReponseFormulaire
  @Post('reponse')
  async createReponse(@Body() dto: { values: Record<string, any>, formulaire: string }): Promise<ReponseFormulaire> {
    return this.formulaireService.createReponseFormulaire(dto);
  }

  @Get('reponse')
  async findAllReponse(): Promise<ReponseFormulaire[]> {
    return this.formulaireService.findAllReponseFormulaire();
  }

  @Get('reponse/:id')
  async findOneReponse(@Param('id') id: string): Promise<ReponseFormulaire> {
    return this.formulaireService.findOneReponseFormulaire(id);
  }

  @Patch('reponse/:id')
  async updateReponse(@Param('id') id: string, @Body() dto: { values?: Record<string, any>, formulaire?: string }): Promise<ReponseFormulaire> {
    return this.formulaireService.updateReponseFormulaire(id, dto);
  }

  @Delete('reponse/:id')
  async removeReponse(@Param('id') id: string): Promise<ReponseFormulaire> {
    return this.formulaireService.removeReponseFormulaire(id);
  }

  @Get('reponse/formulaire/:formulaireId')
  async getReponsesByFormulaire(@Param('formulaireId') formulaireId: string): Promise<ReponseFormulaire[]> {
    return this.formulaireService.findReponsesByFormulaire(formulaireId);
  }

}