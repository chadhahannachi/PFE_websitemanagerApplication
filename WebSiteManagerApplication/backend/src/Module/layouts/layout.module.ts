import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Layout, LayoutSchema } from './layout.schema';
import { LayoutController } from './layout.controller';
import { LayoutService } from './layout.service';


@Module({
  imports: [MongooseModule.forFeature([{ name: Layout.name, schema: LayoutSchema }])],
  controllers: [LayoutController],
  providers: [LayoutService],
  exports: [LayoutService],
})
export class LayoutModule {}
