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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LicenseController = void 0;
const common_1 = require("@nestjs/common");
const license_service_1 = require("../services/license.service");
let LicenseController = class LicenseController {
    constructor(licenseService) {
        this.licenseService = licenseService;
    }
    async getAllLicenses() {
        return this.licenseService.getAllLicenses();
    }
    async getLicenses(companyId) {
        return this.licenseService.getLicenses(companyId);
    }
    async createLicense(licenseData) {
        return this.licenseService.createLicense(licenseData);
    }
    async checkLicense(companyId) {
        return this.licenseService.checkLicense(companyId);
    }
    async getLicenseStatus(licenseId) {
        return this.licenseService.getLicenseStatus(licenseId);
    }
};
exports.LicenseController = LicenseController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LicenseController.prototype, "getAllLicenses", null);
__decorate([
    (0, common_1.Get)(':companyId'),
    __param(0, (0, common_1.Param)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LicenseController.prototype, "getLicenses", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LicenseController.prototype, "createLicense", null);
__decorate([
    (0, common_1.Get)(':companyId/check'),
    __param(0, (0, common_1.Param)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LicenseController.prototype, "checkLicense", null);
__decorate([
    (0, common_1.Get)(':licenseId/status'),
    __param(0, (0, common_1.Param)('licenseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LicenseController.prototype, "getLicenseStatus", null);
exports.LicenseController = LicenseController = __decorate([
    (0, common_1.Controller)('api/licenses'),
    __metadata("design:paramtypes", [license_service_1.LicenseService])
], LicenseController);
//# sourceMappingURL=license.controller.js.map