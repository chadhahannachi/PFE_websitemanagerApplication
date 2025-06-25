import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
//   private readonly licenseServiceUrl: string;

//   constructor(
//     private readonly httpService: HttpService,
//     private readonly configService: ConfigService,
//   ) {
//     const url = this.configService.get<string>('LICENSE_SERVICE_URL');
//     if (!url) {
//       throw new Error('LICENSE_SERVICE_URL environment variable is not defined');
//     }
//     this.licenseServiceUrl = url;
//   }

//   async getLicenses(companyId: string) {
//     try {
//       const response = await firstValueFrom(
//         this.httpService.get(`${this.licenseServiceUrl}/api/licenses/${companyId}`)
//       );
//       return response.data;
//     } catch (error) {
//       throw new Error(`Failed to fetch licenses: ${error.message}`);
//     }
//   }

//   async createLicense(licenseData: any) {
//     try {
//       const response = await firstValueFrom(
//         this.httpService.post(`${this.licenseServiceUrl}/api/licenses`, licenseData)
//       );
//       return response.data;
//     } catch (error) {
//       throw new Error(`Failed to create license: ${error.message}`);
//     }
//   }
}