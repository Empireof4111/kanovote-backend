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
exports.ExportController = void 0;
const common_1 = require("@nestjs/common");
const export_service_1 = require("./export.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_role_enum_1 = require("../../entities/user-role.enum");
let ExportController = class ExportController {
    constructor(exportService) {
        this.exportService = exportService;
    }
    async exportSupportersCSV(res, state, lga, status) {
        const csv = await this.exportService.exportSupportersCSV({ state, lga, status });
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="supporters.csv"');
        res.send(csv);
    }
    async exportAgentsCSV(res, state, lga) {
        const csv = await this.exportService.exportAgentsCSV({ state, lga });
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="agents.csv"');
        res.send(csv);
    }
    async exportRegistrationsCSV(res, agentId, status) {
        const csv = await this.exportService.exportRegistrationsCSV({ agentId, status });
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="registrations.csv"');
        res.send(csv);
    }
};
exports.ExportController = ExportController;
__decorate([
    (0, common_1.Get)('supporters-csv'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)('state')),
    __param(2, (0, common_1.Query)('lga')),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], ExportController.prototype, "exportSupportersCSV", null);
__decorate([
    (0, common_1.Get)('agents-csv'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)('state')),
    __param(2, (0, common_1.Query)('lga')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ExportController.prototype, "exportAgentsCSV", null);
__decorate([
    (0, common_1.Get)('registrations-csv'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)('agentId')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ExportController.prototype, "exportRegistrationsCSV", null);
exports.ExportController = ExportController = __decorate([
    (0, common_1.Controller)('export'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [export_service_1.ExportService])
], ExportController);
//# sourceMappingURL=export.controller.js.map