import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateRedirectionDto } from './dto/create-redirection.dto';
import { UpdateRedirectionDto } from './dto/update-redirection.dto';
import { RedirectionService } from './redirections.service';
import { Redirection } from './schemas/redirection.schema';

@Controller('redirections')
export class RedirectionController {
  constructor(private readonly redirectionService: RedirectionService) {}

  @Post()
  create(@Body() createRedirectionDto: CreateRedirectionDto) {
    return this.redirectionService.create(createRedirectionDto);
  }

  @Get()
  findAll() {
    return this.redirectionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.redirectionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRedirectionDto: UpdateRedirectionDto) {
    return this.redirectionService.update(id, updateRedirectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.redirectionService.remove(id);
  }

  @Get('/entreprise/:entrepriseId/redirections')
  async getRedirectionsByEntreprise(@Param('entrepriseId') entrepriseId: string): Promise<Redirection[]> {
    return this.redirectionService.findRedirectionsByEntreprise(entrepriseId);
  }
}
