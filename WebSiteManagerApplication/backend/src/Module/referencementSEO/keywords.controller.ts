import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';
import { KeywordService } from './keywords.service';
import { Keyword } from './schemas/keyword.schema';

@Controller('keywords')
export class KeywordController {
  constructor(private readonly keywordService: KeywordService) {}

  @Post()
  create(@Body() createKeywordDto: CreateKeywordDto) {
    return this.keywordService.create(createKeywordDto);
  }

  @Get()
  findAll() {
    return this.keywordService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.keywordService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKeywordDto: UpdateKeywordDto) {
    return this.keywordService.update(id, updateKeywordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.keywordService.remove(id);
  }

  @Get('/entreprise/:entrepriseId/keywords')
  async getKeywordsByEntreprise(@Param('entrepriseId') entrepriseId: string): Promise<Keyword[]> {
    return this.keywordService.findKeywordsByEntreprise(entrepriseId);
  }
}
