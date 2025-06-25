// import { HttpService } from '@nestjs/axios';
// import { Injectable, Logger } from '@nestjs/common';
// import { firstValueFrom } from 'rxjs';
// import { AxiosError } from 'axios';
// import { CreateLicenseRequestDto } from './dto/create-license-request.dto';
// import { LicenseRequest } from './interfaces/license-request.interface';
// import { NotificationGateway } from '../notification/notification.gateway';

// @Injectable()
// export class LicenseRequestService {
//   private readonly baseUrl = 'http://127.0.0.1:8000/api';
//   private readonly logger = new Logger(LicenseRequestService.name);

//   // constructor(private readonly httpService: HttpService) {}
//   constructor(private readonly httpService: HttpService, private readonly notificationGateway: NotificationGateway) {}

//   async getAllLicenseRequests(): Promise<LicenseRequest[]> {
//     try {
//       this.logger.debug(`Fetching all license requests from ${this.baseUrl}/licence-requests`);
//       const response = await firstValueFrom(
//         this.httpService.get<LicenseRequest[]>(`${this.baseUrl}/licence-requests`, {
//           headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//           }
//         })
//       );
//       this.logger.debug(`Received ${response.data.length} license requests`);
//       return response.data;
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         this.logger.error(`Axios error fetching license requests: ${error.message}`, {
//           status: error.response?.status,
//           statusText: error.response?.statusText,
//           data: error.response?.data,
//           config: {
//             url: error.config?.url,
//             method: error.config?.method,
//             headers: error.config?.headers,
//           }
//         });
//         throw new Error(`Failed to fetch license requests: ${error.response?.data?.message || error.message}`);
//       }
//       this.logger.error(`Error fetching license requests: ${error.message}`, error.stack);
//       throw new Error(`Failed to fetch license requests: ${error.message}`);
//     }
//   }

//   async getLicenseRequest(id: string): Promise<LicenseRequest> {
//     try {
//       const response = await firstValueFrom(
//         this.httpService.get<LicenseRequest>(`${this.baseUrl}/licence-requests/${id}`, {
//           headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//           }
//         })
//       );
//       return response.data;
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         this.logger.error(`Axios error fetching license request ${id}: ${error.message}`, {
//           status: error.response?.status,
//           statusText: error.response?.statusText,
//           data: error.response?.data,
//           config: {
//             url: error.config?.url,
//             method: error.config?.method,
//             headers: error.config?.headers,
//           }
//         });
//         throw new Error(`Failed to fetch license request: ${error.response?.data?.message || error.message}`);
//       }
//       this.logger.error(`Error fetching license request ${id}: ${error.message}`, error.stack);
//       throw new Error(`Failed to fetch license request: ${error.message}`);
//     }
//   }

//   async createLicenseRequest(licenseRequestData: CreateLicenseRequestDto): Promise<LicenseRequest> {
//     try {
//       const response = await firstValueFrom(
//         this.httpService.post<LicenseRequest>(`${this.baseUrl}/licence-requests`, licenseRequestData, {
//           headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//           }
//         })
//       );

//       const newLicenseRequest = response.data;

//       // After successful creation, send a notification
//       this.notificationGateway.sendNewLicenceRequestNotification(
//         `Nouvelle demande de licence de ${newLicenseRequest.company_name} (${newLicenseRequest.type})`
//       );

//       return newLicenseRequest;
      
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         this.logger.error(`Axios error creating license request: ${error.message}`, {
//           status: error.response?.status,
//           statusText: error.response?.statusText,
//           data: error.response?.data,
//           config: {
//             url: error.config?.url,
//             method: error.config?.method,
//             headers: error.config?.headers,
//             data: error.config?.data,
//           }
//         });
//         throw new Error(`Failed to create license request: ${error.response?.data?.message || error.message}`);
//       }
//       this.logger.error(`Error creating license request: ${error.message}`, error.stack);
//       throw new Error(`Failed to create license request: ${error.message}`);
//     }
//   }

//   async updateLicenseRequest(id: string, licenseRequestData: Partial<CreateLicenseRequestDto>): Promise<LicenseRequest> {
//     try {
//       const response = await firstValueFrom(
//         this.httpService.put<LicenseRequest>(`${this.baseUrl}/licence-requests/${id}`, licenseRequestData, {
//           headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//           }
//         })
//       );
//       return response.data;
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         this.logger.error(`Axios error updating license request ${id}: ${error.message}`, {
//           status: error.response?.status,
//           statusText: error.response?.statusText,
//           data: error.response?.data,
//           config: {
//             url: error.config?.url,
//             method: error.config?.method,
//             headers: error.config?.headers,
//             data: error.config?.data,
//           }
//         });
//         throw new Error(`Failed to update license request: ${error.response?.data?.message || error.message}`);
//       }
//       this.logger.error(`Error updating license request ${id}: ${error.message}`, error.stack);
//       throw new Error(`Failed to update license request: ${error.message}`);
//     }
//   }

//   async deleteLicenseRequest(id: string): Promise<{ message: string }> {
//     try {
//       const response = await firstValueFrom(
//         this.httpService.delete<{ message: string }>(`${this.baseUrl}/licence-requests/${id}`, {
//           headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//           }
//         })
//       );
//       return response.data;
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         this.logger.error(`Axios error deleting license request ${id}: ${error.message}`, {
//           status: error.response?.status,
//           statusText: error.response?.statusText,
//           data: error.response?.data,
//           config: {
//             url: error.config?.url,
//             method: error.config?.method,
//             headers: error.config?.headers,
//           }
//         });
//         throw new Error(`Failed to delete license request: ${error.response?.data?.message || error.message}`);
//       }
//       this.logger.error(`Error deleting license request ${id}: ${error.message}`, error.stack);
//       throw new Error(`Failed to delete license request: ${error.message}`);
//     }
//   }
// } 

import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { CreateLicenseRequestDto } from './dto/create-license-request.dto';
import { LicenseRequest } from './interfaces/license-request.interface';
import { NotificationGateway } from '../notification/notification.gateway';

@Injectable()
export class LicenseRequestService {
  private readonly baseUrl = 'http://127.0.0.1:8000/api';
  private readonly logger = new Logger(LicenseRequestService.name);

  // constructor(private readonly httpService: HttpService) {}
  constructor(private readonly httpService: HttpService, private readonly notificationGateway: NotificationGateway) {}

  async getAllLicenseRequests(): Promise<LicenseRequest[]> {
    try {
      this.logger.debug(`Fetching all license requests from ${this.baseUrl}/licence-requests`);
      const response = await firstValueFrom(
        this.httpService.get<LicenseRequest[]>(`${this.baseUrl}/licence-requests`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
      );
      this.logger.debug(`Received ${response.data.length} license requests`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(`Axios error fetching license requests: ${error.message}`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
          }
        });
        throw new Error(`Failed to fetch license requests: ${error.response?.data?.message || error.message}`);
      }
      this.logger.error(`Error fetching license requests: ${error.message}`, error.stack);
      throw new Error(`Failed to fetch license requests: ${error.message}`);
    }
  }

  async getLicenseRequest(id: string): Promise<LicenseRequest> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<LicenseRequest>(`${this.baseUrl}/licence-requests/${id}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(`Axios error fetching license request ${id}: ${error.message}`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
          }
        });
        throw new Error(`Failed to fetch license request: ${error.response?.data?.message || error.message}`);
      }
      this.logger.error(`Error fetching license request ${id}: ${error.message}`, error.stack);
      throw new Error(`Failed to fetch license request: ${error.message}`);
    }
  }

  async createLicenseRequest(licenseRequestData: CreateLicenseRequestDto): Promise<LicenseRequest> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<LicenseRequest>(`${this.baseUrl}/licence-requests`, licenseRequestData, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
      );

      const newLicenseRequest = response.data;

      // After successful creation, send a notification
      this.notificationGateway.sendNewLicenceRequestNotification(
        `Nouvelle demande de licence de ${newLicenseRequest.company_name} (${newLicenseRequest.type})`
      );

      return newLicenseRequest;
      
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(`Axios error creating license request: ${error.message}`, {
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
        throw new Error(`Failed to create license request: ${error.response?.data?.message || error.message}`);
      }
      this.logger.error(`Error creating license request: ${error.message}`, error.stack);
      throw new Error(`Failed to create license request: ${error.message}`);
    }
  }

  async updateLicenseRequest(id: string, licenseRequestData: Partial<CreateLicenseRequestDto>): Promise<LicenseRequest> {
    try {
      const response = await firstValueFrom(
        this.httpService.put<LicenseRequest>(`${this.baseUrl}/licence-requests/${id}`, licenseRequestData, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(`Axios error updating license request ${id}: ${error.message}`, {
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
        throw new Error(`Failed to update license request: ${error.response?.data?.message || error.message}`);
      }
      this.logger.error(`Error updating license request ${id}: ${error.message}`, error.stack);
      throw new Error(`Failed to update license request: ${error.message}`);
    }
  }

  async deleteLicenseRequest(id: string): Promise<{ message: string }> {
    try {
      const response = await firstValueFrom(
        this.httpService.delete<{ message: string }>(`${this.baseUrl}/licence-requests/${id}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(`Axios error deleting license request ${id}: ${error.message}`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
          }
        });
        throw new Error(`Failed to delete license request: ${error.response?.data?.message || error.message}`);
      }
      this.logger.error(`Error deleting license request ${id}: ${error.message}`, error.stack);
      throw new Error(`Failed to delete license request: ${error.message}`);
    }
  }
} 