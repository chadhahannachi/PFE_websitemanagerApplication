import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Navbar, NavbarSchema } from './schemas/navbar.schema';
import { NavbarController } from './navbars.controller';
import { NavbarService } from './navbars.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Navbar.name, schema: NavbarSchema }])],
  controllers: [NavbarController],
  providers: [NavbarService],
  exports: [NavbarService],
})
export class NavbarModule {}
