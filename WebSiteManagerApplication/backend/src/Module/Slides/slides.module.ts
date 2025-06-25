import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Slide, SlideSchema } from './schemas/slide.schema';
import { SlideController } from './slides.controller';
import { SlideService } from './slides.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Slide.name, schema: SlideSchema }])],
  controllers: [SlideController],
  providers: [SlideService],
  exports: [SlideService],
})
export class SlideModule {}
