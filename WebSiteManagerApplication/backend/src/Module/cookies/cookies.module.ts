import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Cookie, CookieSchema } from './schemas/cookie.schema';
import { CookieController } from './cookies.controller';
import { CookieService } from './cookies.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cookie.name, schema: CookieSchema }])],
  controllers: [CookieController],
  providers: [CookieService],
  exports: [CookieService],
})
export class CookieModule {}
