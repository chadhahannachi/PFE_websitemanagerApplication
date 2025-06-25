import { LicenseService } from '../services/license.service';
export declare class LicenseController {
    private readonly licenseService;
    constructor(licenseService: LicenseService);
    getAllLicenses(): Promise<any>;
    getLicenses(companyId: string): Promise<any>;
    createLicense(licenseData: any): Promise<any>;
    checkLicense(companyId: string): Promise<any>;
    getLicenseStatus(licenseId: string): Promise<any>;
}
