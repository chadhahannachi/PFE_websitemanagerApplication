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
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
let HealthController = class HealthController {
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
    }
    async healthCheck() {
        try {
            const licenseServiceUrl = this.configService.get('LICENSE_SERVICE_URL');
            const licenseResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${licenseServiceUrl}/health`));
            const websiteManagerUrl = this.configService.get('WEBSITE_MANAGER_URL');
            const websiteResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${websiteManagerUrl}/health`));
            return {
                status: 'healthy',
                services: {
                    licenseService: licenseResponse.data,
                    websiteManager: websiteResponse.data,
                },
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'unhealthy',
                error: error.message,
            }, common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "healthCheck", null);
exports.HealthController = HealthController = __decorate([
    (0, common_1.Controller)('health'),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], HealthController);
//# sourceMappingURL=health.controller.js.map