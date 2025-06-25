import { Controller, Get, Post, Put, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { LicenseRequestService } from './license-request.service';
import { CreateLicenseRequestDto } from './dto/create-license-request.dto';
import { LicenseRequest } from './interfaces/license-request.interface';

@Controller('licence-requests')
export class LicenseRequestController {
  constructor(private readonly licenseRequestService: LicenseRequestService) {}

  @Get()
  async getAllLicenseRequests() {
    try {
      return await this.licenseRequestService.getAllLicenseRequests();
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch license requests',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async getLicenseRequest(@Param('id') id: string): Promise<LicenseRequest> {
    try {
      return await this.licenseRequestService.getLicenseRequest(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch license request',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post()
  async createLicenseRequest(@Body() licenseRequestData: CreateLicenseRequestDto): Promise<LicenseRequest> {
    try {
      return await this.licenseRequestService.createLicenseRequest(licenseRequestData);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create license request',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(':id')
  async updateLicenseRequest(
    @Param('id') id: string,
    @Body() licenseRequestData: Partial<CreateLicenseRequestDto>
  ): Promise<LicenseRequest> {
    try {
      return await this.licenseRequestService.updateLicenseRequest(id, licenseRequestData);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update license request',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':id')
  async deleteLicenseRequest(@Param('id') id: string): Promise<{ message: string }> {
    try {
      return await this.licenseRequestService.deleteLicenseRequest(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete license request',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 