import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LicenseService {
  private readonly licenseServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.licenseServiceUrl = this.configService.get<string>('LICENSE_SERVICE_URL');
  }

  async getLicenses(companyId: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.licenseServiceUrl}/api/licences/company/${companyId}`)
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch licenses: ${error.message}`);
    }
  } 

  async getAllLicenses() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.licenseServiceUrl}/api/licences`)
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch all licenses: ${error.message}`);
    }
  }

  async getLicenseById(id: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.licenseServiceUrl}/api/licences/${id}`)
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch license: ${error.message}`);
    }
  }

  async createLicense(licenseData: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.licenseServiceUrl}/api/licences`, licenseData)
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create license: ${error.message}`);
    }
  }

  async checkLicense(companyId: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.licenseServiceUrl}/api/licences/check/${companyId}`)
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to check license: ${error.message}`);
    }
  }

  async getLicenseStatus(licenseId: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.licenseServiceUrl}/api/licences/${licenseId}/status`)
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get license status: ${error.message}`);
    }
  }
} 