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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_role_enum_1 = require("../../entities/user-role.enum");
const dto_1 = require("./dto");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    // DASHBOARD & STATS
    async getDashboard() {
        return this.adminService.getDashboardStats();
    }
    // USER MANAGEMENT
    async getAllUsers(skip = '0', take = '10', role) {
        const [users, total] = await this.adminService.getAllUsers(parseInt(skip), parseInt(take), role);
        return { users, total };
    }
    async getUserStats() {
        return this.adminService.getUserStats();
    }
    async updateUserRole(userId, updateUserRoleDto) {
        return this.adminService.updateUserRole(userId, updateUserRoleDto);
    }
    async blockUser(userId) {
        return this.adminService.blockUser(userId);
    }
    async unblockUser(userId) {
        return this.adminService.unblockUser(userId);
    }
    // AGENT STATS
    async getAgentStats() {
        return this.adminService.getAgentStats();
    }
    // LOCAL GOVERNMENT AREA (LGA) MANAGEMENT
    async createLga(createLgaDto) {
        return this.adminService.createLga(createLgaDto);
    }
    async getAllLgas(skip = '0', take = '100') {
        const [lgas, total] = await this.adminService.getAllLgas(parseInt(skip), parseInt(take));
        return { lgas, total };
    }
    async getLgaById(id) {
        return this.adminService.getLgaById(id);
    }
    async updateLga(id, updateLgaDto) {
        return this.adminService.updateLga(id, updateLgaDto);
    }
    async deleteLga(id) {
        await this.adminService.deleteLga(id);
    }
    // WARD MANAGEMENT
    async createWard(createWardDto) {
        return this.adminService.createWard(createWardDto);
    }
    async getAllWards(lgaId, skip = '0', take = '100') {
        const [wards, total] = await this.adminService.getAllWards(lgaId, parseInt(skip), parseInt(take));
        return { wards, total };
    }
    async getWardById(id) {
        return this.adminService.getWardById(id);
    }
    async updateWard(id, updateWardDto) {
        return this.adminService.updateWard(id, updateWardDto);
    }
    async deleteWard(id) {
        await this.adminService.deleteWard(id);
    }
    // POLLING UNIT MANAGEMENT
    async createPollingUnit(createPollingUnitDto) {
        return this.adminService.createPollingUnit(createPollingUnitDto);
    }
    async getAllPollingUnits(wardId, lgaId, skip = '0', take = '100') {
        const [pollingUnits, total] = await this.adminService.getAllPollingUnits(wardId, lgaId, parseInt(skip), parseInt(take));
        return { pollingUnits, total };
    }
    async getPollingUnitById(id) {
        return this.adminService.getPollingUnitById(id);
    }
    async updatePollingUnit(id, updatePollingUnitDto) {
        return this.adminService.updatePollingUnit(id, updatePollingUnitDto);
    }
    async deletePollingUnit(id) {
        await this.adminService.deletePollingUnit(id);
    }
    // GET LOCATION HIERARCHY
    async getLocationHierarchy() {
        return this.adminService.getLocationHierarchy();
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.SUPERVISOR, user_role_enum_1.UserRole.FIELD_AGENT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('users'),
    __param(0, (0, common_1.Query)('skip')),
    __param(1, (0, common_1.Query)('take')),
    __param(2, (0, common_1.Query)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)('users/stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUserStats", null);
__decorate([
    (0, common_1.Put)('users/:id/role'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateUserRoleDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateUserRole", null);
__decorate([
    (0, common_1.Put)('users/:id/block'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "blockUser", null);
__decorate([
    (0, common_1.Put)('users/:id/unblock'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "unblockUser", null);
__decorate([
    (0, common_1.Get)('agents/stats'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.SUPERVISOR, user_role_enum_1.UserRole.FIELD_AGENT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAgentStats", null);
__decorate([
    (0, common_1.Post)('locations/lga'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateLgaDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createLga", null);
__decorate([
    (0, common_1.Get)('locations/lga'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.SUPERVISOR, user_role_enum_1.UserRole.FIELD_AGENT),
    __param(0, (0, common_1.Query)('skip')),
    __param(1, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllLgas", null);
__decorate([
    (0, common_1.Get)('locations/lga/:id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.SUPERVISOR, user_role_enum_1.UserRole.FIELD_AGENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getLgaById", null);
__decorate([
    (0, common_1.Put)('locations/lga/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateLgaDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateLga", null);
__decorate([
    (0, common_1.Delete)('locations/lga/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteLga", null);
__decorate([
    (0, common_1.Post)('locations/ward'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateWardDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createWard", null);
__decorate([
    (0, common_1.Get)('locations/ward'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.SUPERVISOR, user_role_enum_1.UserRole.FIELD_AGENT),
    __param(0, (0, common_1.Query)('lgaId')),
    __param(1, (0, common_1.Query)('skip')),
    __param(2, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllWards", null);
__decorate([
    (0, common_1.Get)('locations/ward/:id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.SUPERVISOR, user_role_enum_1.UserRole.FIELD_AGENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getWardById", null);
__decorate([
    (0, common_1.Put)('locations/ward/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateWardDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateWard", null);
__decorate([
    (0, common_1.Delete)('locations/ward/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteWard", null);
__decorate([
    (0, common_1.Post)('locations/polling-unit'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreatePollingUnitDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createPollingUnit", null);
__decorate([
    (0, common_1.Get)('locations/polling-unit'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.SUPERVISOR, user_role_enum_1.UserRole.FIELD_AGENT),
    __param(0, (0, common_1.Query)('wardId')),
    __param(1, (0, common_1.Query)('lgaId')),
    __param(2, (0, common_1.Query)('skip')),
    __param(3, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllPollingUnits", null);
__decorate([
    (0, common_1.Get)('locations/polling-unit/:id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.SUPERVISOR, user_role_enum_1.UserRole.FIELD_AGENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getPollingUnitById", null);
__decorate([
    (0, common_1.Put)('locations/polling-unit/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdatePollingUnitDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updatePollingUnit", null);
__decorate([
    (0, common_1.Delete)('locations/polling-unit/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deletePollingUnit", null);
__decorate([
    (0, common_1.Get)('locations/hierarchy'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.SUPERVISOR, user_role_enum_1.UserRole.FIELD_AGENT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getLocationHierarchy", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map