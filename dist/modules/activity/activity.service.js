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
exports.ActivityService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const activity_log_entity_1 = require("../../entities/activity-log.entity");
let ActivityService = class ActivityService {
    constructor(activityRepository) {
        this.activityRepository = activityRepository;
    }
    async log(userId, action, entityType, entityId, details, ipAddress, userAgent) {
        const log = this.activityRepository.create({
            userId,
            action,
            entityType,
            entityId,
            details,
            ipAddress,
            userAgent,
        });
        return this.activityRepository.save(log);
    }
    async findByUser(userId, skip = 0, take = 10) {
        return this.activityRepository.findAndCount({
            where: { userId },
            skip,
            take,
            order: { createdAt: 'DESC' },
            relations: ['user'],
        });
    }
    async findByAction(action, skip = 0, take = 10) {
        return this.activityRepository.findAndCount({
            where: { action },
            skip,
            take,
            order: { createdAt: 'DESC' },
            relations: ['user'],
        });
    }
    async findByEntity(entityType, entityId) {
        return this.activityRepository.find({
            where: { entityType, entityId },
            order: { createdAt: 'DESC' },
            relations: ['user'],
        });
    }
    async getRecentActivity(limit = 20) {
        return this.activityRepository.find({
            take: limit,
            order: { createdAt: 'DESC' },
            relations: ['user'],
        });
    }
    async getAuditLog(skip = 0, take = 10, filters) {
        let query = this.activityRepository.createQueryBuilder('log');
        if (filters?.userId) {
            query = query.where('log.userId = :userId', { userId: filters.userId });
        }
        if (filters?.action) {
            query = query.andWhere('log.action = :action', { action: filters.action });
        }
        return query
            .leftJoinAndSelect('log.user', 'user')
            .skip(skip)
            .take(take)
            .orderBy('log.createdAt', 'DESC')
            .getManyAndCount();
    }
};
exports.ActivityService = ActivityService;
exports.ActivityService = ActivityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(activity_log_entity_1.ActivityLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ActivityService);
//# sourceMappingURL=activity.service.js.map