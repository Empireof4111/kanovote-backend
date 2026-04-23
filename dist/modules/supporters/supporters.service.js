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
exports.SupporterService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const agent_entity_1 = require("../../entities/agent.entity");
const supporter_entity_1 = require("../../entities/supporter.entity");
const user_role_enum_1 = require("../../entities/user-role.enum");
let SupporterService = class SupporterService {
    constructor(supporterRepository, agentRepository) {
        this.supporterRepository = supporterRepository;
        this.agentRepository = agentRepository;
    }
    async create(createSupporterDto, registeredByUserId) {
        const normalizedEmail = createSupporterDto.email?.trim().toLowerCase() || null;
        const normalizedPhone = createSupporterDto.phone.trim();
        const normalizedVoterCardNumber = createSupporterDto.voterCardNumber.trim();
        const duplicateConditions = [
            { phone: normalizedPhone },
            { voterCardNumber: normalizedVoterCardNumber },
        ];
        if (normalizedEmail) {
            duplicateConditions.push({ email: normalizedEmail });
        }
        const existingSupporter = await this.supporterRepository.findOne({
            where: duplicateConditions,
        });
        if (existingSupporter) {
            if (existingSupporter.phone === normalizedPhone) {
                throw new common_1.BadRequestException('This phone number has already been used to register a supporter');
            }
            if (normalizedEmail && existingSupporter.email === normalizedEmail) {
                throw new common_1.BadRequestException('Supporter with this email already exists');
            }
            if (existingSupporter.voterCardNumber === normalizedVoterCardNumber) {
                throw new common_1.BadRequestException('Supporter with this voter card number already exists');
            }
            throw new common_1.BadRequestException('Supporter already exists');
        }
        const supporter = this.supporterRepository.create({
            ...createSupporterDto,
            email: normalizedEmail,
            phone: normalizedPhone,
            voterCardNumber: normalizedVoterCardNumber,
            registeredByUserId,
        });
        return this.supporterRepository.save(supporter);
    }
    async findById(id) {
        const supporter = await this.supporterRepository.findOne({
            where: { id },
            relations: ['registeredByUser'],
        });
        if (!supporter) {
            throw new common_1.NotFoundException('Supporter not found');
        }
        return supporter;
    }
    async findAll(skip = 0, take = 10, filters, requester) {
        const query = this.supporterRepository.createQueryBuilder('supporter');
        if (requester?.role === user_role_enum_1.UserRole.SUPERVISOR) {
            const supervisorAgent = await this.findSupervisorAgentByUserId(requester.id);
            query
                .innerJoin(agent_entity_1.Agent, 'registeredAgent', 'registeredAgent.userId = supporter.registeredByUserId')
                .andWhere('registeredAgent.role = :fieldAgentRole', { fieldAgentRole: user_role_enum_1.UserRole.FIELD_AGENT })
                .andWhere('registeredAgent.lga = :supervisorLga', { supervisorLga: supervisorAgent.lga });
        }
        if (filters?.state) {
            query.andWhere('supporter.state = :state', { state: filters.state });
        }
        if (filters?.lga) {
            query.andWhere('supporter.lga = :lga', { lga: filters.lga });
        }
        if (filters?.status) {
            query.andWhere('supporter.status = :status', { status: filters.status });
        }
        if (filters?.search) {
            query.andWhere('(supporter.firstName ILIKE :search OR supporter.lastName ILIKE :search OR COALESCE(supporter.email, \'\') ILIKE :search OR supporter.phone ILIKE :search)', { search: `%${filters.search}%` });
        }
        return query
            .leftJoinAndSelect('supporter.registeredByUser', 'user')
            .skip(skip)
            .take(take)
            .orderBy('supporter.registeredAt', 'DESC')
            .getManyAndCount();
    }
    async update(id, updateSupporterDto) {
        const supporter = await this.findById(id);
        Object.assign(supporter, updateSupporterDto);
        return this.supporterRepository.save(supporter);
    }
    async verify(id, verifySupporterDto, verifiedByUserId) {
        const supporter = await this.findById(id);
        supporter.status = verifySupporterDto.status;
        supporter.verificationNotes = verifySupporterDto.notes || '';
        supporter.verifiedByUserId = verifiedByUserId;
        supporter.verifiedAt = new Date();
        return this.supporterRepository.save(supporter);
    }
    async findByIdForRequester(id, requester) {
        const supporter = await this.findById(id);
        if (requester.role === user_role_enum_1.UserRole.SUPERVISOR) {
            await this.assertSupervisorCanAccessSupporter(requester.id, supporter.id);
        }
        return supporter;
    }
    async verifyForRequester(id, verifySupporterDto, requester) {
        if (requester.role === user_role_enum_1.UserRole.SUPERVISOR) {
            await this.assertSupervisorCanAccessSupporter(requester.id, id);
        }
        return this.verify(id, verifySupporterDto, requester.id);
    }
    async getStatistics() {
        const [total, verified, pending, rejected] = await Promise.all([
            this.supporterRepository.count(),
            this.supporterRepository.count({ where: { status: supporter_entity_1.VerificationStatus.VERIFIED } }),
            this.supporterRepository.count({ where: { status: supporter_entity_1.VerificationStatus.PENDING } }),
            this.supporterRepository.count({ where: { status: supporter_entity_1.VerificationStatus.REJECTED } }),
        ]);
        return {
            total,
            verified,
            pending,
            rejected,
            verificationRate: total > 0 ? ((verified / total) * 100).toFixed(2) : 0,
        };
    }
    async getStatisticsByLocation(state, lga) {
        let query = this.supporterRepository.createQueryBuilder('supporter')
            .where('supporter.state = :state', { state });
        if (lga) {
            query = query.andWhere('supporter.lga = :lga', { lga });
        }
        const [total, verified, pending] = await Promise.all([
            query.clone().getCount(),
            query.clone().andWhere('supporter.status = :verified', { verified: supporter_entity_1.VerificationStatus.VERIFIED }).getCount(),
            query.clone().andWhere('supporter.status = :pending', { pending: supporter_entity_1.VerificationStatus.PENDING }).getCount(),
        ]);
        return {
            state,
            lga: lga || null,
            total,
            verified,
            pending,
            verificationRate: total > 0 ? ((verified / total) * 100).toFixed(2) : 0,
        };
    }
    async delete(id) {
        const supporter = await this.findById(id);
        await this.supporterRepository.remove(supporter);
    }
    async findSupervisorAgentByUserId(userId) {
        const supervisorAgent = await this.agentRepository.findOne({
            where: { userId, role: user_role_enum_1.UserRole.SUPERVISOR },
        });
        if (!supervisorAgent) {
            throw new common_1.ForbiddenException('Supervisor profile not found');
        }
        return supervisorAgent;
    }
    async assertSupervisorCanAccessSupporter(supervisorUserId, supporterId) {
        const supervisorAgent = await this.findSupervisorAgentByUserId(supervisorUserId);
        const scopedSupporter = await this.supporterRepository
            .createQueryBuilder('supporter')
            .innerJoin(agent_entity_1.Agent, 'registeredAgent', 'registeredAgent.userId = supporter.registeredByUserId')
            .where('supporter.id = :supporterId', { supporterId })
            .andWhere('registeredAgent.role = :fieldAgentRole', { fieldAgentRole: user_role_enum_1.UserRole.FIELD_AGENT })
            .andWhere('registeredAgent.lga = :supervisorLga', { supervisorLga: supervisorAgent.lga })
            .getOne();
        if (!scopedSupporter) {
            throw new common_1.ForbiddenException('You can only access supporters registered by field agents in your local government area');
        }
    }
};
exports.SupporterService = SupporterService;
exports.SupporterService = SupporterService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(supporter_entity_1.Supporter)),
    __param(1, (0, typeorm_1.InjectRepository)(agent_entity_1.Agent)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SupporterService);
//# sourceMappingURL=supporters.service.js.map