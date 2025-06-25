import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Page, PageSchema } from './schemas/page.schema';
import { PageController } from './pages.controller';
import { PageService } from './pages.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Page.name, schema: PageSchema }])],
  controllers: [PageController],
  providers: [PageService],
  exports: [PageService],
})
export class PageModule {}
