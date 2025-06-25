import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Controller('health')
export class HealthController {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async healthCheck() {
    try {
      // Vérifier la santé du License Service
      const licenseServiceUrl = this.configService.get<string>('LICENSE_SERVICE_URL');
      const licenseResponse = await firstValueFrom(
        this.httpService.get(`${licenseServiceUrl}/health`)
      );

      // Vérifier la santé du Website Manager
      const websiteManagerUrl = this.configService.get<string>('WEBSITE_MANAGER_URL');
      const websiteResponse = await firstValueFrom(
        this.httpService.get(`${websiteManagerUrl}/health`)
      );

      return {
        status: 'healthy',
        services: {
          licenseService: licenseResponse.data,
          websiteManager: websiteResponse.data,
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'unhealthy',
          error: error.message,
        },
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }
  }
}
