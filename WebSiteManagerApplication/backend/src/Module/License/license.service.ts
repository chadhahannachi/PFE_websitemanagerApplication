import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse, AxiosError } from 'axios';
import { CreateLicenseDto } from './dto/create-license.dto';
import { License, LicenseStatus } from './interfaces/license.interface';

@Injectable()
export class LicenseService { 
  private readonly baseUrl = 'http://127.0.0.1:8000/api';

  private readonly logger = new Logger(LicenseService.name);

  constructor(private readonly httpService: HttpService) {}

  async getAllLicenses(): Promise<License[]> {
    try {
      this.logger.debug(`Fetching all licenses from ${this.baseUrl}/licences`);
      const response = await firstValueFrom(
        this.httpService.get<License[]>(`${this.baseUrl}/licences`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
      );
      this.logger.debug(`Received ${response.data.length} licenses`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(`Axios error fetching licenses: ${error.message}`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
          }
        });
        throw new Error(`Failed to fetch licenses: ${error.response?.data?.message || error.message}`);
      }
      this.logger.error(`Error fetching licenses: ${error.message}`, error.stack);
      throw new Error(`Failed to fetch licenses: ${error.message}`);
    }
  }

  async getLicense(id: string): Promise<License> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<License>(`${this.baseUrl}/licences/${id}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(`Axios error fetching license ${id}: ${error.message}`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
          }
        });
        throw new Error(`Failed to fetch license: ${error.response?.data?.message || error.message}`);
      }
      this.logger.error(`Error fetching license ${id}: ${error.message}`, error.stack);
      throw new Error(`Failed to fetch license: ${error.message}`);
    }
  }

  async createLicense(licenseData: CreateLicenseDto): Promise<License> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<License>(`${this.baseUrl}/licences`, licenseData, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(`Axios error creating license: ${error.message}`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
            data: error.config?.data,
          }
        });
        throw new Error(`Failed to create license: ${error.response?.data?.message || error.message}`);
      }
      this.logger.error(`Error creating license: ${error.message}`, error.stack);
      throw new Error(`Failed to create license: ${error.message}`);
    }
  }

  async updateLicense(id: string, licenseData: Partial<CreateLicenseDto>): Promise<License> {
    try {
      const response = await firstValueFrom(
        this.httpService.put<License>(`${this.baseUrl}/licences/${id}`, licenseData, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(`Axios error updating license ${id}: ${error.message}`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
            data: error.config?.data,
          }
        });
        throw new Error(`Failed to update license: ${error.response?.data?.message || error.message}`);
      }
      this.logger.error(`Error updating license ${id}: ${error.message}`, error.stack);
      throw new Error(`Failed to update license: ${error.message}`);
    }
  }

  async deleteLicense(id: string): Promise<{ message: string }> {
    try {
      const response = await firstValueFrom(
        this.httpService.delete<{ message: string }>(`${this.baseUrl}/licences/${id}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(`Axios error deleting license ${id}: ${error.message}`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
          }
        });
        throw new Error(`Failed to delete license: ${error.response?.data?.message || error.message}`);
      }
      this.logger.error(`Error deleting license ${id}: ${error.message}`, error.stack);
      throw new Error(`Failed to delete license: ${error.message}`);
    }
  }

  async getLicenseStatus(id: string): Promise<LicenseStatus> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<LicenseStatus>(`${this.baseUrl}/licences/${id}/status`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(`Axios error getting license status ${id}: ${error.message}`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
          }
        });
        throw new Error(`Failed to get license status: ${error.response?.data?.message || error.message}`);
      }
      this.logger.error(`Error getting license status ${id}: ${error.message}`, error.stack);
      throw new Error(`Failed to get license status: ${error.message}`);
    }
  }

  async getLicenseByMongoCompanyId(mongoCompanyId: string): Promise<License> {
    try {
      const response = await firstValueFrom( 
        this.httpService.get<License>(`${this.baseUrl}/licences/company/${mongoCompanyId}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(`Axios error getting license for company ${mongoCompanyId}: ${error.message}`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
          }
        });
        throw new Error(`Failed to get license for company: ${error.response?.data?.message || error.message}`);
      }
      this.logger.error(`Error getting license for company ${mongoCompanyId}: ${error.message}`, error.stack);
      throw new Error(`Failed to get license for company: ${error.message}`);
    }
  }

  async checkLicense(mongoCompanyId: string): Promise<LicenseStatus> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<LicenseStatus>(`${this.baseUrl}/licences/check/${mongoCompanyId}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(`Axios error checking license for company ${mongoCompanyId}: ${error.message}`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
          }
        });
        throw new Error(`Failed to check license: ${error.response?.data?.message || error.message}`);
      }
      this.logger.error(`Error checking license for company ${mongoCompanyId}: ${error.message}`, error.stack);
      throw new Error(`Failed to check license: ${error.message}`);
    }
  }
} 