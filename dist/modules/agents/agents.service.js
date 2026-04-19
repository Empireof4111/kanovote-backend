"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentService = void 0;
const common_1 = require("@nestjs/common");
const agent_entity_1 = require("../../entities/agent.entity");
let AgentService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AgentService = _classThis = class {
        constructor(agentRepository, userRepository) {
            this.agentRepository = agentRepository;
            this.userRepository = userRepository;
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
    __setFunctionName(_classThis, "AgentService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AgentService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AgentService = _classThis;
})();
exports.AgentService = AgentService;
//# sourceMappingURL=agents.service.js.map