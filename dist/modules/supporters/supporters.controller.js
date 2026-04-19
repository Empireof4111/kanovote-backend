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
exports.SupporterController = void 0;
const common_1 = require("@nestjs/common");
const supporters_service_1 = require("./supporters.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("../../entities/user.entity");
const dto_1 = require("./dto");
let SupporterController = class SupporterController {
    constructor(supporterService) {
        this.supporterService = supporterService;
    }
    async create(req, createSupporterDto) {
        return this.supporterService.create(createSupporterDto, req.user.id);
    }
    async findAll(skip = '0', take = '10', state, lga, status, search) {
        const [supporters, total] = await this.supporterService.findAll(parseInt(skip), parseInt(take), { state, lga, status: status, search });
        return { supporters, total };
    }
    async getStatistics() {
        return this.supporterService.getStatistics();
    }
    async getStatisticsByLocation(state, lga) {
        return this.supporterService.getStatisticsByLocation(state, lga);
    }
    async findById(id) {
        return this.supporterService.findById(id);
    }
    async update(id, updateSupporterDto) {
        return this.supporterService.update(id, updateSupporterDto);
    }
    async verify(req, id, verifySupporterDto) {
        return this.supporterService.verify(id, verifySupporterDto, req.user.id);
    }
    async delete(id) {
        await this.supporterService.delete(id);
    }
};
exports.SupporterController = SupporterController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.FIELD_AGENT, user_entity_1.UserRole.SUPERVISOR),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateSupporterDto]),
    __metadata("design:returntype", Promise)
], SupporterController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.SUPERVISOR),
    __param(0, (0, common_1.Query)('skip')),
    __param(1, (0, common_1.Query)('take')),
    __param(2, (0, common_1.Query)('state')),
    __param(3, (0, common_1.Query)('lga')),
    __param(4, (0, common_1.Query)('status')),
    __param(5, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], SupporterController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SupporterController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('statistics/:state'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.SUPERVISOR),
    __param(0, (0, common_1.Param)('state')),
    __param(1, (0, common_1.Query)('lga')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SupporterController.prototype, "getStatisticsByLocation", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.SUPERVISOR, user_entity_1.UserRole.FIELD_AGENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupporterController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.FIELD_AGENT, user_entity_1.UserRole.SUPERVISOR),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateSupporterDto]),
    __metadata("design:returntype", Promise)
], SupporterController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/verify'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.SUPERVISOR),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.VerifySupporterDto]),
    __metadata("design:returntype", Promise)
], SupporterController.prototype, "verify", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupporterController.prototype, "delete", null);
exports.SupporterController = SupporterController = __decorate([
    (0, common_1.Controller)('supporters'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [supporters_service_1.SupporterService])
], SupporterController);
//# sourceMappingURL=supporters.controller.js.map