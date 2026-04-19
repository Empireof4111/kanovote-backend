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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../entities/user.entity");
const agent_entity_1 = require("../../entities/agent.entity");
const lga_entity_1 = require("../../entities/lga.entity");
const ward_entity_1 = require("../../entities/ward.entity");
const polling_unit_entity_1 = require("../../entities/polling-unit.entity");
const supporter_entity_1 = require("../../entities/supporter.entity");
const registration_entity_1 = require("../../entities/registration.entity");
let AdminService = class AdminService {
    constructor(userRepository, agentRepository, lgaRepository, wardRepository, pollingUnitRepository, supporterRepository, registrationRepository) {
        this.userRepository = userRepository;
        this.agentRepository = agentRepository;
        this.lgaRepository = lgaRepository;
        this.wardRepository = wardRepository;
        this.pollingUnitRepository = pollingUnitRepository;
        this.supporterRepository = supporterRepository;
        this.registrationRepository = registrationRepository;
    }
    // USER MANAGEMENT
    async getAllUsers(skip = 0, take = 10, role) {
        let query = this.userRepository.createQueryBuilder('user');
        if (role) {
            query = query.where('user.role = :role', { role });
        }
        return query
            .skip(skip)
            .take(take)
            .orderBy('user.createdAt', 'DESC')
            .getManyAndCount();
    }
    async getUserStats() {
        const [total, superAdmins, supervisors, fieldAgents] = await Promise.all([
            this.userRepository.count(),
            this.userRepository.count({ where: { role: user_entity_1.UserRole.SUPER_ADMIN } }),
            this.userRepository.count({ where: { role: user_entity_1.UserRole.SUPERVISOR } }),
            this.userRepository.count({ where: { role: user_entity_1.UserRole.FIELD_AGENT } }),
        ]);
        return {
            total,
            superAdmins,
            supervisors,
            fieldAgents,
        };
    }
    async updateUserRole(userId, updateUserRoleDto) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        user.role = updateUserRoleDto.role;
        return this.userRepository.save(user);
    }
    async blockUser(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        user.isActive = false;
        return this.userRepository.save(user);
    }
    async unblockUser(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        user.isActive = true;
        return this.userRepository.save(user);
    }
    // AGENT STATS
    async getAgentStats() {
        const [total, active, inactive, suspended] = await Promise.all([
            this.agentRepository.count(),
            this.agentRepository.count({ where: { status: agent_entity_1.AgentStatus.ACTIVE } }),
            this.agentRepository.count({ where: { status: agent_entity_1.AgentStatus.INACTIVE } }),
            this.agentRepository.count({ where: { status: agent_entity_1.AgentStatus.SUSPENDED } }),
        ]);
        return {
            total,
            active,
            inactive,
            suspended,
        };
    }
    // LOCAL GOVERNMENT AREA (LGA) MANAGEMENT
    async createLga(createLgaDto) {
        // Check if LGA with this code already exists
        const existingLga = await this.lgaRepository.findOne({
            where: { code: createLgaDto.code },
        });
        if (existingLga) {
            throw new common_1.ConflictException('LGA with this code already exists');
        }
        const lga = this.lgaRepository.create(createLgaDto);
        return this.lgaRepository.save(lga);
    }
    async getAllLgas(skip = 0, take = 100) {
        return this.lgaRepository.findAndCount({
            skip,
            take,
            relations: ['wards'],
            order: { name: 'ASC' },
        });
    }
    async getLgaById(id) {
        const lga = await this.lgaRepository.findOne({
            where: { id },
            relations: ['wards'],
        });
        if (!lga) {
            throw new common_1.NotFoundException('LGA not found');
        }
        return lga;
    }
    async updateLga(id, updateLgaDto) {
        const lga = await this.getLgaById(id);
        // Check if new code conflicts with existing LGA
        if (updateLgaDto.code && updateLgaDto.code !== lga.code) {
            const existingLga = await this.lgaRepository.findOne({
                where: { code: updateLgaDto.code },
            });
            if (existingLga) {
                throw new common_1.ConflictException('LGA with this code already exists');
            }
        }
        Object.assign(lga, updateLgaDto);
        return this.lgaRepository.save(lga);
    }
    async deleteLga(id) {
        const lga = await this.getLgaById(id);
        await this.lgaRepository.remove(lga);
    }
    // WARD MANAGEMENT
    async createWard(createWardDto) {
        // Verify LGA exists
        const lga = await this.getLgaById(createWardDto.lgaId);
        // Check if Ward with this code already exists in this LGA
        const existingWard = await this.wardRepository.findOne({
            where: {
                lgaId: createWardDto.lgaId,
                code: createWardDto.code,
            },
        });
        if (existingWard) {
            throw new common_1.ConflictException('Ward with this code already exists in this LGA');
        }
        const ward = this.wardRepository.create({
            ...createWardDto,
            lga,
        });
        return this.wardRepository.save(ward);
    }
    async getAllWards(lgaId, skip = 0, take = 100) {
        let query = this.wardRepository.createQueryBuilder('ward');
        if (lgaId) {
            query = query.where('ward.lgaId = :lgaId', { lgaId });
        }
        return query
            .leftJoinAndSelect('ward.lga', 'lga')
            .skip(skip)
            .take(take)
            .orderBy('ward.name', 'ASC')
            .getManyAndCount();
    }
    async getWardById(id) {
        const ward = await this.wardRepository.findOne({
            where: { id },
            relations: ['lga', 'pollingUnits'],
        });
        if (!ward) {
            throw new common_1.NotFoundException('Ward not found');
        }
        return ward;
    }
    async updateWard(id, updateWardDto) {
        const ward = await this.getWardById(id);
        // Check if new code conflicts with existing Ward in same LGA
        if (updateWardDto.code && updateWardDto.code !== ward.code) {
            const existingWard = await this.wardRepository.findOne({
                where: {
                    lgaId: ward.lgaId,
                    code: updateWardDto.code,
                },
            });
            if (existingWard) {
                throw new common_1.ConflictException('Ward with this code already exists in this LGA');
            }
        }
        Object.assign(ward, updateWardDto);
        return this.wardRepository.save(ward);
    }
    async deleteWard(id) {
        const ward = await this.getWardById(id);
        await this.wardRepository.remove(ward);
    }
    // POLLING UNIT MANAGEMENT
    async createPollingUnit(createPollingUnitDto) {
        // Verify Ward and LGA exist
        const ward = await this.getWardById(createPollingUnitDto.wardId);
        const lga = await this.getLgaById(createPollingUnitDto.lgaId);
        // Check if code already exists
        const existingPu = await this.pollingUnitRepository.findOne({
            where: { code: createPollingUnitDto.code },
        });
        if (existingPu) {
            throw new common_1.ConflictException('Polling Unit with this code already exists');
        }
        const pollingUnit = this.pollingUnitRepository.create({
            ...createPollingUnitDto,
            ward,
            lga,
        });
        return this.pollingUnitRepository.save(pollingUnit);
    }
    async getAllPollingUnits(wardId, lgaId, skip = 0, take = 100) {
        let query = this.pollingUnitRepository.createQueryBuilder('pu');
        if (wardId) {
            query = query.where('pu.wardId = :wardId', { wardId });
        }
        if (lgaId) {
            query = query.andWhere('pu.lgaId = :lgaId', { lgaId });
        }
        return query
            .leftJoinAndSelect('pu.ward', 'ward')
            .leftJoinAndSelect('pu.lga', 'lga')
            .skip(skip)
            .take(take)
            .orderBy('pu.name', 'ASC')
            .getManyAndCount();
    }
    async getPollingUnitById(id) {
        const pu = await this.pollingUnitRepository.findOne({
            where: { id },
            relations: ['ward', 'lga'],
        });
        if (!pu) {
            throw new common_1.NotFoundException('Polling Unit not found');
        }
        return pu;
    }
    async updatePollingUnit(id, updatePollingUnitDto) {
        const pu = await this.getPollingUnitById(id);
        // Check if new code conflicts
        if (updatePollingUnitDto.code && updatePollingUnitDto.code !== pu.code) {
            const existingPu = await this.pollingUnitRepository.findOne({
                where: { code: updatePollingUnitDto.code },
            });
            if (existingPu) {
                throw new common_1.ConflictException('Polling Unit with this code already exists');
            }
        }
        Object.assign(pu, updatePollingUnitDto);
        return this.pollingUnitRepository.save(pu);
    }
    async deletePollingUnit(id) {
        const pu = await this.getPollingUnitById(id);
        await this.pollingUnitRepository.remove(pu);
    }
    // SUPPORTER STATS
    async getSupporterStats() {
        const [total, verified, pending, rejected] = await Promise.all([
            this.supporterRepository.count(),
            this.registrationRepository.count({ where: { status: registration_entity_1.RegistrationStatus.VERIFIED } }),
            this.registrationRepository.count({ where: { status: registration_entity_1.RegistrationStatus.IN_PROGRESS } }),
            this.registrationRepository.count({ where: { status: registration_entity_1.RegistrationStatus.REJECTED } }),
        ]);
        return {
            total,
            verified,
            pending,
            rejected,
        };
    }
    // DASHBOARD STATS
    async getDashboardStats() {
        const [userStats, agentStats, supporterStats, lgaCount, wardCount, puCount] = await Promise.all([
            this.getUserStats(),
            this.getAgentStats(),
            this.getSupporterStats(),
            this.lgaRepository.count(),
            this.wardRepository.count(),
            this.pollingUnitRepository.count(),
        ]);
        return {
            users: userStats,
            agents: agentStats,
            supporters: supporterStats,
            geography: {
                lgas: lgaCount,
                wards: wardCount,
                pollingUnits: puCount,
            },
        };
    }
    // GET LOCATION DATA IN HIERARCHICAL FORMAT
    async getLocationHierarchy() {
        const lgas = await this.lgaRepository.find({
            relations: ['wards'],
            order: { name: 'ASC' },
        });
        const wards = await this.wardRepository.find({
            relations: ['lga', 'pollingUnits'],
            order: { name: 'ASC' },
        });
        const pollingUnits = await this.pollingUnitRepository.find({
            relations: ['ward', 'lga'],
            order: { name: 'ASC' },
        });
        return {
            lgas,
            wards,
            pollingUnits,
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(agent_entity_1.Agent)),
    __param(2, (0, typeorm_1.InjectRepository)(lga_entity_1.LocalGovernmentArea)),
    __param(3, (0, typeorm_1.InjectRepository)(ward_entity_1.Ward)),
    __param(4, (0, typeorm_1.InjectRepository)(polling_unit_entity_1.PollingUnit)),
    __param(5, (0, typeorm_1.InjectRepository)(supporter_entity_1.Supporter)),
    __param(6, (0, typeorm_1.InjectRepository)(registration_entity_1.Registration)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map