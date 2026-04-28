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
const registration_entity_1 = require("../../entities/registration.entity");
const user_entity_1 = require("../../entities/user.entity");
const user_role_enum_1 = require("../../entities/user-role.enum");
let AgentService = class AgentService {
    constructor(agentRepository, registrationRepository, userRepository) {
        this.agentRepository = agentRepository;
        this.registrationRepository = registrationRepository;
        this.userRepository = userRepository;
    }
    // Register new agent with user creation
    async registerAgent(registerAgentDto) {
        const { email, phone, password, firstName, lastName, ...agentData } = registerAgentDto;
        // Check if user with this email already exists
        const existingUser = await this.userRepository.findOne({
            where: { email },
        });
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        let savedUser;
        if (existingUser) {
            const existingAgent = await this.agentRepository.findOne({
                where: { userId: existingUser.id },
            });
            if (existingAgent) {
                throw new common_1.ConflictException('User with this email already exists');
            }
            existingUser.firstName = firstName;
            existingUser.lastName = lastName;
            existingUser.phone = phone;
            existingUser.password = hashedPassword;
            existingUser.role = agentData.role;
            existingUser.isActive = true;
            savedUser = await this.userRepository.save(existingUser);
        }
        else {
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
            savedUser = await this.userRepository.save(user);
        }
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
        return this.attachRegistrationStats(agent);
    }
    async findByUserId(userId) {
        const agent = await this.agentRepository.findOne({
            where: { userId },
            relations: ['user', 'registrations'],
        });
        if (!agent) {
            return null;
        }
        return this.attachRegistrationStats(agent);
    }
    async findAll(skip = 0, take = 10, filters, requester) {
        const query = this.agentRepository.createQueryBuilder('agent');
        if (requester?.role === user_role_enum_1.UserRole.SUPERVISOR) {
            const supervisorAgent = await this.findSupervisorAgentByUserId(requester.id);
            query
                .andWhere('agent.lga = :supervisorLga', { supervisorLga: supervisorAgent.lga })
                .andWhere('agent.role = :fieldAgentRole', { fieldAgentRole: user_role_enum_1.UserRole.FIELD_AGENT });
        }
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
        const [agents, total] = await query
            .leftJoinAndSelect('agent.user', 'user')
            .skip(skip)
            .take(take)
            .orderBy('agent.joinedAt', 'DESC')
            .getManyAndCount();
        const hydratedAgents = await Promise.all(agents.map((agent) => this.attachRegistrationStats(agent)));
        return [hydratedAgents, total];
    }
    async findByIdForRequester(id, requester) {
        const agent = await this.findById(id);
        if (requester.role === user_role_enum_1.UserRole.SUPERVISOR) {
            await this.assertSupervisorCanAccessAgent(requester.id, agent);
        }
        return agent;
    }
    async update(id, updateAgentDto) {
        const agent = await this.findById(id);
        const { firstName, lastName, email, phone, state, lga, ward, status, notes, } = updateAgentDto;
        if (email && email !== agent.user.email) {
            const existingUser = await this.userRepository.findOne({
                where: { email },
            });
            if (existingUser && existingUser.id !== agent.userId) {
                throw new common_1.ConflictException('Another user with this email already exists');
            }
        }
        if (firstName !== undefined) {
            agent.user.firstName = firstName;
        }
        if (lastName !== undefined) {
            agent.user.lastName = lastName;
        }
        if (email !== undefined) {
            agent.user.email = email;
        }
        if (phone !== undefined) {
            agent.user.phone = phone;
        }
        if (state !== undefined) {
            agent.state = state;
        }
        if (lga !== undefined) {
            agent.lga = lga;
        }
        if (ward !== undefined) {
            agent.ward = ward;
        }
        if (status !== undefined) {
            agent.status = status;
        }
        if (notes !== undefined) {
            agent.notes = notes;
        }
        agent.lastActivityAt = new Date();
        await this.userRepository.save(agent.user);
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
        const hydratedAgent = await this.attachRegistrationStats(agent);
        await this.agentRepository.save(hydratedAgent);
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
        agent.user.isActive = false;
        await this.userRepository.save(agent.user);
        return this.agentRepository.save(agent);
    }
    async suspend(id) {
        const agent = await this.findById(id);
        agent.status = agent_entity_1.AgentStatus.SUSPENDED;
        agent.user.isActive = false;
        await this.userRepository.save(agent.user);
        return this.agentRepository.save(agent);
    }
    async activate(id) {
        const agent = await this.findById(id);
        agent.status = agent_entity_1.AgentStatus.ACTIVE;
        agent.lastActivityAt = new Date();
        agent.user.isActive = true;
        await this.userRepository.save(agent.user);
        return this.agentRepository.save(agent);
    }
    async delete(id) {
        const agent = await this.findById(id);
        if ((agent.registrations?.length || 0) > 0) {
            throw new common_1.BadRequestException('This field agent cannot be deleted because they already have registration records. Deactivate the agent instead.');
        }
        await this.agentRepository.remove(agent);
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
    async assertSupervisorCanAccessAgent(supervisorUserId, agent) {
        const supervisorAgent = await this.findSupervisorAgentByUserId(supervisorUserId);
        if (agent.role !== user_role_enum_1.UserRole.FIELD_AGENT || agent.lga !== supervisorAgent.lga) {
            throw new common_1.ForbiddenException('You can only access field agents in your local government area');
        }
    }
    async attachRegistrationStats(agent) {
        const [total, verified, rejected, initiated, inProgress, completed] = await Promise.all([
            this.registrationRepository.count({ where: { agentId: agent.id } }),
            this.registrationRepository.count({
                where: { agentId: agent.id, status: registration_entity_1.RegistrationStatus.VERIFIED },
            }),
            this.registrationRepository.count({
                where: { agentId: agent.id, status: registration_entity_1.RegistrationStatus.REJECTED },
            }),
            this.registrationRepository.count({
                where: { agentId: agent.id, status: registration_entity_1.RegistrationStatus.INITIATED },
            }),
            this.registrationRepository.count({
                where: { agentId: agent.id, status: registration_entity_1.RegistrationStatus.IN_PROGRESS },
            }),
            this.registrationRepository.count({
                where: { agentId: agent.id, status: registration_entity_1.RegistrationStatus.COMPLETED },
            }),
        ]);
        agent.totalRegistrations = total;
        agent.verifiedRegistrations = verified;
        agent.rejectedRegistrations = rejected;
        agent.pendingRegistrations = initiated + inProgress + completed;
        return agent;
    }
};
exports.AgentService = AgentService;
exports.AgentService = AgentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(agent_entity_1.Agent)),
    __param(1, (0, typeorm_1.InjectRepository)(registration_entity_1.Registration)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AgentService);
//# sourceMappingURL=agents.service.js.map