import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class HealthController {
    private readonly httpService;
    private readonly configService;
    constructor(httpService: HttpService, configService: ConfigService);
    healthCheck(): Promise<{
        status: string;
        services: {
            licenseService: any;
            websiteManager: any;
        };
    }>;
}
