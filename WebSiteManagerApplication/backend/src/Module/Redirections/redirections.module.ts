import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Redirection, RedirectionSchema } from './schemas/redirection.schema';
import { RedirectionController } from './redirections.controller';
import { RedirectionService } from './redirections.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Redirection.name, schema: RedirectionSchema }])],
  controllers: [RedirectionController],
  providers: [RedirectionService],
  exports: [RedirectionService],
})
export class RedirectionModule {}
