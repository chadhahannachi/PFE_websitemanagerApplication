import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class LicenseService {
    private readonly httpService;
    private readonly configService;
    private readonly licenseServiceUrl;
    constructor(httpService: HttpService, configService: ConfigService);
    getLicenses(companyId: string): Promise<any>;
    getAllLicenses(): Promise<any>;
    getLicenseById(id: string): Promise<any>;
    createLicense(licenseData: any): Promise<any>;
    checkLicense(companyId: string): Promise<any>;
    getLicenseStatus(licenseId: string): Promise<any>;
}
