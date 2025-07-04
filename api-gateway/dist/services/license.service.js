"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LicenseService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
let LicenseService = class LicenseService {
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.licenseServiceUrl = this.configService.get('LICENSE_SERVICE_URL');
    }
    async getLicenses(companyId) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.licenseServiceUrl}/api/licences/company/${companyId}`));
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to fetch licenses: ${error.message}`);
        }
    }
    async getAllLicenses() {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.licenseServiceUrl}/api/licences`));
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to fetch all licenses: ${error.message}`);
        }
    }
    async getLicenseById(id) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.licenseServiceUrl}/api/licences/${id}`));
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to fetch license: ${error.message}`);
        }
    }
    async createLicense(licenseData) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.licenseServiceUrl}/api/licences`, licenseData));
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to create license: ${error.message}`);
        }
    }
    async checkLicense(companyId) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.licenseServiceUrl}/api/licences/check/${companyId}`));
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to check license: ${error.message}`);
        }
    }
    async getLicenseStatus(licenseId) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.licenseServiceUrl}/api/licences/${licenseId}/status`));
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to get license status: ${error.message}`);
        }
    }
};
exports.LicenseService = LicenseService;
exports.LicenseService = LicenseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], LicenseService);
//# sourceMappingURL=license.service.js.map