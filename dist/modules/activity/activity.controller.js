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
exports.ActivityController = void 0;
const common_1 = require("@nestjs/common");
const activity_service_1 = require("./activity.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_role_enum_1 = require("../../entities/user-role.enum");
const activity_log_entity_1 = require("../../entities/activity-log.entity");
let ActivityController = class ActivityController {
    constructor(activityService) {
        this.activityService = activityService;
    }
    async getRecentActivity(limit = '20') {
        return this.activityService.getRecentActivity(parseInt(limit));
    }
    async getAuditLog(skip = '0', take = '10', userId, action) {
        const [logs, total] = await this.activityService.getAuditLog(parseInt(skip), parseInt(take), { userId, action });
        return { logs, total };
    }
    async findByUser(userId, skip = '0', take = '10') {
        const [logs, total] = await this.activityService.findByUser(userId, parseInt(skip), parseInt(take));
        return { logs, total };
    }
    async findByEntity(entityType, entityId) {
        return this.activityService.findByEntity(entityType, entityId);
    }
};
exports.ActivityController = ActivityController;
__decorate([
    (0, common_1.Get)('recent'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ActivityController.prototype, "getRecentActivity", null);
__decorate([
    (0, common_1.Get)('audit-log'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Query)('skip')),
    __param(1, (0, common_1.Query)('take')),
    __param(2, (0, common_1.Query)('userId')),
    __param(3, (0, common_1.Query)('action')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], ActivityController.prototype, "getAuditLog", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('skip')),
    __param(2, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ActivityController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Get)('entity/:entityType/:entityId'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('entityType')),
    __param(1, (0, common_1.Param)('entityId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ActivityController.prototype, "findByEntity", null);
exports.ActivityController = ActivityController = __decorate([
    (0, common_1.Controller)('activity'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [activity_service_1.ActivityService])
], ActivityController);
//# sourceMappingURL=activity.controller.js.map