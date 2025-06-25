import { Controller, Get, Post, Put, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { LicenseService } from './license.service';
import { CreateLicenseDto } from './dto/create-license.dto';
import { License, LicenseStatus } from './interfaces/license.interface';

@Controller('licences')
export class LicenseController {
  constructor(private readonly licenseService: LicenseService) {}

  @Get()
  async getAllLicenses() {
    try {
      return await this.licenseService.getAllLicenses();
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch licenses',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async getLicense(@Param('id') id: string): Promise<License> {
    try {
      return await this.licenseService.getLicense(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch license',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post()
  async createLicense(@Body() licenseData: CreateLicenseDto): Promise<License> {
    try {
      return await this.licenseService.createLicense(licenseData);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create license',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(':id')
  async updateLicense(
    @Param('id') id: string,
    @Body() licenseData: Partial<CreateLicenseDto>
  ): Promise<License> {
    try {
      return await this.licenseService.updateLicense(id, licenseData);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update license',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':id')
  async deleteLicense(@Param('id') id: string): Promise<{ message: string }> {
    try {
      return await this.licenseService.deleteLicense(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete license',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id/status')
  async getLicenseStatus(@Param('id') id: string): Promise<LicenseStatus> {
    try {
      return await this.licenseService.getLicenseStatus(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get license status',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('mongo/:mongoCompanyId')
  async getLicenseByMongoCompanyId(
    @Param('mongoCompanyId') mongoCompanyId: string
  ): Promise<License> {
    try {
      return await this.licenseService.getLicenseByMongoCompanyId(mongoCompanyId);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get license by company ID',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('check/:mongoCompanyId')
  async checkLicense(
    @Param('mongoCompanyId') mongoCompanyId: string
  ): Promise<LicenseStatus> {
    try {
      return await this.licenseService.checkLicense(mongoCompanyId);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to check license',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 