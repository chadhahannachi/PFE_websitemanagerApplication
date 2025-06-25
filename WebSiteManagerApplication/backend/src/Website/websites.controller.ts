import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Website } from './schemas/website.schema';
import { CreateWebsiteDto } from './dto/create-website.dto';
import { WebsiteService } from './websites.service';

@Controller('websites')
export class WebsiteController {
  constructor(private readonly websiteService: WebsiteService) {}

  @Post()
  create(@Body() createWebsiteDto: CreateWebsiteDto) {
    return this.websiteService.create(createWebsiteDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.websiteService.findOne(id);
  }


  @Get('/user/:userId/websites')
  async getWebsitesByUser(@Param('userId') userId: string): Promise<Website[]> {
    return this.websiteService.findByUser(userId);
  }
}
