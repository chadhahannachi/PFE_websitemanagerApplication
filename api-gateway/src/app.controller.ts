import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('licenses')
export class AppController {
//   constructor(private readonly appService: AppService) {}

//   @Get(':companyId')
//   async getLicenses(@Param('companyId') companyId: string) {
//     return this.appService.getLicenses(companyId);
//   }

//   @Post()
//   async createLicense(@Body() licenseData: any) {
//     return this.appService.createLicense(licenseData);
//   }
} 