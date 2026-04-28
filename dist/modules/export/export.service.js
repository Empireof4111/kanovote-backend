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
exports.ExportService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const supporter_entity_1 = require("../../entities/supporter.entity");
const agent_entity_1 = require("../../entities/agent.entity");
const registration_entity_1 = require("../../entities/registration.entity");
const json2csv_1 = require("json2csv");
let ExportService = class ExportService {
    constructor(supporterRepository, agentRepository, registrationRepository) {
        this.supporterRepository = supporterRepository;
        this.agentRepository = agentRepository;
        this.registrationRepository = registrationRepository;
    }
    async exportSupportersCSV(filters) {
        let query = this.supporterRepository.createQueryBuilder('supporter');
        if (filters?.state) {
            query = query.where('supporter.state = :state', { state: filters.state });
        }
        if (filters?.lga) {
            query = query.andWhere('supporter.lga = :lga', { lga: filters.lga });
        }
        if (filters?.status) {
            query = query.andWhere('supporter.status = :status', { status: filters.status });
        }
        const supporters = await query.getMany();
        const fields = [
            'id',
            'firstName',
            'lastName',
            'email',
            'phone',
            'gender',
            'occupation',
            'state',
            'lga',
            'ward',
            'pollingUnit',
            'voterCardNumber',
            'status',
            'registeredAt',
        ];
        const parser = new json2csv_1.Parser({ fields });
        return parser.parse(supporters);
    }
    async exportAgentsCSV(filters) {
        let query = this.agentRepository.createQueryBuilder('agent');
        if (filters?.state) {
            query = query.where('agent.state = :state', { state: filters.state });
        }
        if (filters?.lga) {
            query = query.andWhere('agent.lga = :lga', { lga: filters.lga });
        }
        const agents = await query.leftJoinAndSelect('agent.user', 'user').getMany();
        const registrationCounts = await this.registrationRepository
            .createQueryBuilder('registration')
            .select('registration.agentId', 'agentId')
            .addSelect('COUNT(registration.id)', 'totalRegistrations')
            .addSelect("COUNT(CASE WHEN registration.status = 'verified' THEN 1 END)", 'verifiedRegistrations')
            .addSelect("COUNT(CASE WHEN registration.status IN ('initiated', 'in_progress', 'completed') THEN 1 END)", 'pendingRegistrations')
            .addSelect("COUNT(CASE WHEN registration.status = 'rejected' THEN 1 END)", 'rejectedRegistrations')
            .groupBy('registration.agentId')
            .getRawMany();
        const countsByAgentId = new Map(registrationCounts.map((row) => [
            row.agentId,
            {
                totalRegistrations: Number(row.totalRegistrations || 0),
                verifiedRegistrations: Number(row.verifiedRegistrations || 0),
                pendingRegistrations: Number(row.pendingRegistrations || 0),
                rejectedRegistrations: Number(row.rejectedRegistrations || 0),
            },
        ]));
        const data = agents.map((agent) => ({
            ...(countsByAgentId.get(agent.id) || {
                totalRegistrations: 0,
                verifiedRegistrations: 0,
                pendingRegistrations: 0,
                rejectedRegistrations: 0,
            }),
            id: agent.id,
            name: `${agent.user.firstName} ${agent.user.lastName}`,
            email: agent.user.email,
            phone: agent.user.phone,
            role: agent.role,
            state: agent.state,
            lga: agent.lga,
            ward: agent.ward,
            status: agent.status,
            joinedAt: agent.joinedAt,
        }));
        const fields = [
            'id',
            'name',
            'email',
            'phone',
            'role',
            'state',
            'lga',
            'ward',
            'totalRegistrations',
            'verifiedRegistrations',
            'pendingRegistrations',
            'rejectedRegistrations',
            'status',
            'joinedAt',
        ];
        const parser = new json2csv_1.Parser({ fields });
        return parser.parse(data);
    }
    async exportRegistrationsCSV(filters) {
        let query = this.registrationRepository.createQueryBuilder('registration');
        if (filters?.agentId) {
            query = query.where('registration.agentId = :agentId', { agentId: filters.agentId });
        }
        if (filters?.status) {
            query = query.andWhere('registration.status = :status', { status: filters.status });
        }
        const registrations = await query
            .leftJoinAndSelect('registration.supporter', 'supporter')
            .leftJoinAndSelect('registration.agent', 'agent')
            .getMany();
        const data = registrations.map((reg) => ({
            id: reg.id,
            supporterName: `${reg.supporter.firstName} ${reg.supporter.lastName}`,
            supporterEmail: reg.supporter.email,
            state: reg.supporter.state,
            lga: reg.supporter.lga,
            status: reg.status,
            completionPercentage: reg.completionPercentage,
            createdAt: reg.createdAt,
            completedAt: reg.completedAt,
        }));
        const fields = [
            'id',
            'supporterName',
            'supporterEmail',
            'state',
            'lga',
            'status',
            'completionPercentage',
            'createdAt',
            'completedAt',
        ];
        const parser = new json2csv_1.Parser({ fields });
        return parser.parse(data);
    }
};
exports.ExportService = ExportService;
exports.ExportService = ExportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(supporter_entity_1.Supporter)),
    __param(1, (0, typeorm_1.InjectRepository)(agent_entity_1.Agent)),
    __param(2, (0, typeorm_1.InjectRepository)(registration_entity_1.Registration)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ExportService);
//# sourceMappingURL=export.service.js.map