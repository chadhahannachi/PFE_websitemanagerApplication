import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { LicenseService } from '../services/license.service';

@Controller('api/licenses')
export class LicenseController {
  constructor(private readonly licenseService: LicenseService) {}

  @Get('all')
  async getAllLicenses() {
    return this.licenseService.getAllLicenses();
  }

  @Get(':companyId')
  async getLicenses(@Param('companyId') companyId: string) {
    return this.licenseService.getLicenses(companyId);
  }

  @Post()
  async createLicense(@Body() licenseData: any) {
    return this.licenseService.createLicense(licenseData);
  }

  @Get(':companyId/check')
  async checkLicense(@Param('companyId') companyId: string) {
    return this.licenseService.checkLicense(companyId);
  }

  @Get(':licenseId/status')
  async getLicenseStatus(@Param('licenseId') licenseId: string) {
    return this.licenseService.getLicenseStatus(licenseId);
  }
} 