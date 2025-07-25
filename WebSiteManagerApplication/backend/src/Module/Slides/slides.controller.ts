import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { SlideService } from './slides.service';
import { Slide } from './schemas/slide.schema';

@Controller('slides')
export class SlideController {
  constructor(private readonly slideService: SlideService) {}

  @Post()
  create(@Body() createSlideDto: CreateSlideDto) {
    return this.slideService.create(createSlideDto);
  }

  @Get()
  findAll() {
    return this.slideService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.slideService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSlideDto: UpdateSlideDto) {
    return this.slideService.update(id, updateSlideDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.slideService.remove(id);
  }

  @Patch(':id/archive')
  archive(@Param('id') id: string) {
    return this.slideService.archiveSlide(id);
  }

  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.slideService.restoreSlide(id);
  }

  @Get('/entreprise/:entrepriseId/archived')
  getArchivedSlidesByEntreprise(@Param('entrepriseId') entrepriseId: string) {
    return this.slideService.findArchivedSlidesByEntreprise(entrepriseId);
  }

    @Get('/entreprise/:entrepriseId/slides')
    async getSlidesByEntreprise(@Param('entrepriseId') entrepriseId: string): Promise<Slide[]> {
        return this.slideService.findSlideByEntreprise(entrepriseId);
    }


      
}
