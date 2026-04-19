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
exports.RegistrationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const registration_entity_1 = require("../../entities/registration.entity");
let RegistrationService = class RegistrationService {
    constructor(registrationRepository) {
        this.registrationRepository = registrationRepository;
    }
    async create(agentId, supporterId) {
        const registration = this.registrationRepository.create({
            agentId,
            supporterId,
            status: registration_entity_1.RegistrationStatus.INITIATED,
        });
        return this.registrationRepository.save(registration);
    }
    async findById(id) {
        const registration = await this.registrationRepository.findOne({
            where: { id },
            relations: ['agent', 'supporter'],
        });
        if (!registration) {
            throw new common_1.NotFoundException('Registration not found');
        }
        return registration;
    }
    async findByAgentId(agentId, skip = 0, take = 10) {
        return this.registrationRepository.findAndCount({
            where: { agentId },
            relations: ['supporter'],
            skip,
            take,
            order: { createdAt: 'DESC' },
        });
    }
    async findBySupporterId(supporterId) {
        return this.registrationRepository.find({
            where: { supporterId },
            relations: ['agent'],
        });
    }
    async updateStatus(id, status) {
        const registration = await this.findById(id);
        registration.status = status;
        if (status === registration_entity_1.RegistrationStatus.COMPLETED) {
            registration.completedAt = new Date();
            registration.completionPercentage = 100;
        }
        if (status === registration_entity_1.RegistrationStatus.VERIFIED) {
            registration.verifiedAt = new Date();
        }
        return this.registrationRepository.save(registration);
    }
    async getRegistrationStats() {
        const [total, initiated, inProgress, completed, verified, rejected] = await Promise.all([
            this.registrationRepository.count(),
            this.registrationRepository.count({ where: { status: registration_entity_1.RegistrationStatus.INITIATED } }),
            this.registrationRepository.count({ where: { status: registration_entity_1.RegistrationStatus.IN_PROGRESS } }),
            this.registrationRepository.count({ where: { status: registration_entity_1.RegistrationStatus.COMPLETED } }),
            this.registrationRepository.count({ where: { status: registration_entity_1.RegistrationStatus.VERIFIED } }),
            this.registrationRepository.count({ where: { status: registration_entity_1.RegistrationStatus.REJECTED } }),
        ]);
        return {
            total,
            initiated,
            inProgress,
            completed,
            verified,
            rejected,
        };
    }
};
exports.RegistrationService = RegistrationService;
exports.RegistrationService = RegistrationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(registration_entity_1.Registration)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RegistrationService);
//# sourceMappingURL=registrations.service.js.map