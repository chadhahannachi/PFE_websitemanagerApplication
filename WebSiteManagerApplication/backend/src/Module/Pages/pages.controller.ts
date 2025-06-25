import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { PageService } from './pages.service';
import { Page } from './schemas/page.schema';

@Controller('pages')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Post()
  create(@Body() createPageDto: CreatePageDto) {
    return this.pageService.create(createPageDto);
  }

  @Get()
  findAll() {
    return this.pageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pageService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePageDto: UpdatePageDto) {
    return this.pageService.update(id, updatePageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pageService.remove(id);
  }

  @Get('/entreprise/:entrepriseId/pages')
  async getPagesByEntreprise(@Param('entrepriseId') entrepriseId: string): Promise<Page[]> {
    return this.pageService.findPagesByEntreprise(entrepriseId);
  }
}
