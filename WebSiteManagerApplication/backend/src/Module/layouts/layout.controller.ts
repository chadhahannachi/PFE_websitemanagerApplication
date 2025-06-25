import { Controller, Get, Post, Body } from "@nestjs/common";
import { LayoutService } from "./layout.service";

@Controller("layout")
export class LayoutController {
  constructor(private readonly layoutService: LayoutService) {}

  @Get()
  getLayout() {
    return this.layoutService.getLayout();
  }

  @Post()
  updateLayout(@Body() data: { sections: { id: number; type: string }[] }) {
    return this.layoutService.updateLayout(data.sections);
  }
}
