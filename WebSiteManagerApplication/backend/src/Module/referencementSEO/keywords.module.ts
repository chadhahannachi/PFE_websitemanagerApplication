import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Keyword, KeywordSchema } from './schemas/keyword.schema';
import { KeywordController } from './keywords.controller';
import { KeywordService } from './keywords.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Keyword.name, schema: KeywordSchema }])],
  controllers: [KeywordController],
  providers: [KeywordService],
  exports: [KeywordService],
})
export class KeywordModule {}
