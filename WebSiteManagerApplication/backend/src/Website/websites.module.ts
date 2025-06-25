import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Website, WebsiteSchema } from './schemas/website.schema';
import { WebsiteController } from './websites.controller';
import { WebsiteService } from './websites.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Website.name, schema: WebsiteSchema }])],
  controllers: [WebsiteController],
  providers: [WebsiteService],
  exports: [WebsiteService],
})
export class WebsiteModule {}
