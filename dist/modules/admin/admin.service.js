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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../../entities/user.entity");
const agent_entity_1 = require("../../entities/agent.entity");
let AdminService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AdminService = _classThis = class {
        constructor(userRepository, agentRepository) {
            this.userRepository = userRepository;
            this.agentRepository = agentRepository;
        }
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
        async updateUserRole(userId, newRole) {
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            user.role = newRole;
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
        async getDashboardStats() {
            const userStats = await this.getUserStats();
            const agentStats = await this.getAgentStats();
            return {
                users: userStats,
                agents: agentStats,
            };
        }
    };
    __setFunctionName(_classThis, "AdminService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminService = _classThis;
})();
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map