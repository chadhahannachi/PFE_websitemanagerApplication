import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Menu, MenuSchema } from './schemas/menu.schema';
import { MenuController } from './menus.controller';
import { MenuService } from './menus.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Menu.name, schema: MenuSchema }])],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
