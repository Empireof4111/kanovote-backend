"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcryptjs"));
const agent_entity_1 = require("../../entities/agent.entity");
const user_entity_1 = require("../../entities/user.entity");
let AgentService = class AgentService {
    constructor(agentRepository, userRepository) {
        this.agentRepository = agentRepository;
        this.userRepository = userRepository;
    }
    // Register new agent with user creation
    async registerAgent(registerAgentDto) {
        const { email, phone, password, firstName, lastName, ...agentData } = registerAgentDto;
        // Check if user with this email already exists
        const existingUser = await this.userRepository.findOne({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Generate username from email (take part before @)
        const username = email.split('@')[0] + '_' + Math.random().toString(36).substring(7);
        // Create user
        const user = this.userRepository.create({
            email,
            phone,
            firstName,
            lastName,
            username,
            password: hashedPassword,
            role: agentData.role,
            isActive: true,
        });
        const savedUser = await this.userRepository.save(user);
        // Create agent
        const agent = this.agentRepository.create({
            userId: savedUser.id,
            ...agentData,
        });
        const savedAgent = await this.agentRepository.save(agent);
        return { agent: savedAgent, user: savedUser };
    }
    async create(createAgentDto) {
        const user = await this.userRepository.findOne({
            where: { id: createAgentDto.userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        // Check if agent already exists for this user
        const existingAgent = await this.agentRepository.findOne({
            where: { userId: createAgentDto.userId },
        });
        if (existingAgent) {
            throw new common_1.BadRequestException('Agent already exists for this user');
        }
        const agent = this.agentRepository.create(createAgentDto);
        return this.agentRepository.save(agent);
    }
    async findById(id) {
        const agent = await this.agentRepository.findOne({
            where: { id },
            relations: ['user', 'registrations'],
        });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        return agent;
    }
    async findByUserId(userId) {
        return this.agentRepository.findOne({
            where: { userId },
            relations: ['user', 'registrations'],
        });
    }
    async findAll(skip = 0, take = 10, filters) {
        const query = this.agentRepository.createQueryBuilder('agent');
        if (filters?.state) {
            query.andWhere('agent.state = :state', { state: filters.state });
        }
        if (filters?.lga) {
            query.andWhere('agent.lga = :lga', { lga: filters.lga });
        }
        if (filters?.role) {
            query.andWhere('agent.role = :role', { role: filters.role });
        }
        if (filters?.status) {
            query.andWhere('agent.status = :status', { status: filters.status });
        }
        return query
            .leftJoinAndSelect('agent.user', 'user')
            .skip(skip)
            .take(take)
            .orderBy('agent.joinedAt', 'DESC')
            .getManyAndCount();
    }
    async update(id, updateAgentDto) {
        const agent = await this.findById(id);
        Object.assign(agent, updateAgentDto);
        agent.lastActivityAt = new Date();
        return this.agentRepository.save(agent);
    }
    // Reset agent password
    async resetPassword(userId, resetPasswordDto) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);
        user.password = hashedPassword;
        await this.userRepository.save(user);
    }
    async updateRegistrationStats(agentId) {
        const agent = await this.findById(agentId);
        const stats = await this.agentRepository
            .createQueryBuilder('agent')
            .leftJoinAndSelect('agent.registrations', 'registration')
            .select('COUNT(CASE WHEN registration.status = :verified THEN 1 END)', 'verifiedCount')
            .addSelect('COUNT(CASE WHEN registration.status = :pending THEN 1 END)', 'pendingCount')
            .addSelect('COUNT(CASE WHEN registration.status = :rejected THEN 1 END)', 'rejectedCount')
            .addSelect('COUNT(registration.id)', 'totalCount')
            .where('agent.id = :agentId', { agentId })
            .setParameters({
            verified: 'verified',
            pending: 'pending',
            rejected: 'rejected',
        })
            .getRawOne();
        agent.totalRegistrations = parseInt(stats?.totalCount || 0);
        agent.verifiedRegistrations = parseInt(stats?.verifiedCount || 0);
        agent.pendingRegistrations = parseInt(stats?.pendingCount || 0);
        agent.rejectedRegistrations = parseInt(stats?.rejectedCount || 0);
        await this.agentRepository.save(agent);
    }
    async getPerformanceReport(agentId) {
        const agent = await this.findById(agentId);
        return {
            agentId: agent.id,
            agentName: `${agent.user.firstName} ${agent.user.lastName}`,
            role: agent.role,
            state: agent.state,
            lga: agent.lga,
            ward: agent.ward,
            totalRegistrations: agent.totalRegistrations,
            verifiedRegistrations: agent.verifiedRegistrations,
            pendingRegistrations: agent.pendingRegistrations,
            rejectedRegistrations: agent.rejectedRegistrations,
            verificationRate: agent.totalRegistrations > 0
                ? ((agent.verifiedRegistrations / agent.totalRegistrations) * 100).toFixed(2)
                : 0,
            joinedAt: agent.joinedAt,
            lastActivityAt: agent.lastActivityAt,
            status: agent.status,
        };
    }
    async deactivate(id) {
        const agent = await this.findById(id);
        agent.status = agent_entity_1.AgentStatus.INACTIVE;
        return this.agentRepository.save(agent);
    }
    async suspend(id) {
        const agent = await this.findById(id);
        agent.status = agent_entity_1.AgentStatus.SUSPENDED;
        return this.agentRepository.save(agent);
    }
    async activate(id) {
        const agent = await this.findById(id);
        agent.status = agent_entity_1.AgentStatus.ACTIVE;
        agent.lastActivityAt = new Date();
        return this.agentRepository.save(agent);
    }
    async delete(id) {
        const agent = await this.findById(id);
        await this.agentRepository.remove(agent);
    }
};
exports.AgentService = AgentService;
exports.AgentService = AgentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(agent_entity_1.Agent)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AgentService);
//# sourceMappingURL=agents.service.js.map