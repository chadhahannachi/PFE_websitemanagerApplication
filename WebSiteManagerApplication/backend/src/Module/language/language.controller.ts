import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { Language } from './schemas/language.schema';
import { LanguageService } from './language.service';

@Controller('languages')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Post()
  create(@Body() createLanguageDto: CreateLanguageDto) {
    return this.languageService.create(createLanguageDto);
  }

  @Get()
  findAll() {
    return this.languageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.languageService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLanguageDto: UpdateLanguageDto) {
    return this.languageService.update(id, updateLanguageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.languageService.remove(id);
  }


   @Get('/entreprise/:entrepriseId/pages')
    async getLanguageByEntreprise(@Param('entrepriseId') entrepriseId: string): Promise<Language[]> {
      return this.languageService.findLanguageByEntreprise(entrepriseId);
    }
  
}
