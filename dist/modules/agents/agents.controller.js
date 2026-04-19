"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("../../entities/user.entity");
let AgentController = (() => {
    let _classDecorators = [(0, common_1.Controller)('agents'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _create_decorators;
    let _findAll_decorators;
    let _findByUserId_decorators;
    let _findById_decorators;
    let _getPerformanceReport_decorators;
    let _update_decorators;
    let _activate_decorators;
    let _deactivate_decorators;
    let _suspend_decorators;
    let _delete_decorators;
    var AgentController = _classThis = class {
        constructor(agentService) {
            this.agentService = (__runInitializers(this, _instanceExtraInitializers), agentService);
        }
        async create(createAgentDto) {
            return this.agentService.create(createAgentDto);
        }
        async findAll(query) {
            const skip = query.skip || 0;
            const take = query.take || 10;
            const [agents, total] = await this.agentService.findAll(skip, take, query);
            return { agents, total };
        }
        async findByUserId(userId) {
            return this.agentService.findByUserId(userId);
        }
        async findById(id) {
            return this.agentService.findById(id);
        }
        async getPerformanceReport(id) {
            return this.agentService.getPerformanceReport(id);
        }
        async update(id, updateAgentDto) {
            return this.agentService.update(id, updateAgentDto);
        }
        async activate(id) {
            return this.agentService.activate(id);
        }
        async deactivate(id) {
            return this.agentService.deactivate(id);
        }
        async suspend(id) {
            return this.agentService.suspend(id);
        }
        async delete(id) {
            await this.agentService.delete(id);
        }
    };
    __setFunctionName(_classThis, "AgentController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED)];
        _findAll_decorators = [(0, common_1.Get)(), (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.SUPERVISOR)];
        _findByUserId_decorators = [(0, common_1.Get)('user/:userId'), (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.SUPERVISOR, user_entity_1.UserRole.FIELD_AGENT)];
        _findById_decorators = [(0, common_1.Get)(':id'), (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.SUPERVISOR)];
        _getPerformanceReport_decorators = [(0, common_1.Get)(':id/performance'), (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.SUPERVISOR)];
        _update_decorators = [(0, common_1.Put)(':id'), (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN)];
        _activate_decorators = [(0, common_1.Put)(':id/activate'), (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN)];
        _deactivate_decorators = [(0, common_1.Put)(':id/deactivate'), (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN)];
        _suspend_decorators = [(0, common_1.Put)(':id/suspend'), (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN)];
        _delete_decorators = [(0, common_1.Delete)(':id'), (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN), (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT)];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: obj => "create" in obj, get: obj => obj.create }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: obj => "findAll" in obj, get: obj => obj.findAll }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findByUserId_decorators, { kind: "method", name: "findByUserId", static: false, private: false, access: { has: obj => "findByUserId" in obj, get: obj => obj.findByUserId }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findById_decorators, { kind: "method", name: "findById", static: false, private: false, access: { has: obj => "findById" in obj, get: obj => obj.findById }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPerformanceReport_decorators, { kind: "method", name: "getPerformanceReport", static: false, private: false, access: { has: obj => "getPerformanceReport" in obj, get: obj => obj.getPerformanceReport }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: obj => "update" in obj, get: obj => obj.update }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _activate_decorators, { kind: "method", name: "activate", static: false, private: false, access: { has: obj => "activate" in obj, get: obj => obj.activate }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deactivate_decorators, { kind: "method", name: "deactivate", static: false, private: false, access: { has: obj => "deactivate" in obj, get: obj => obj.deactivate }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _suspend_decorators, { kind: "method", name: "suspend", static: false, private: false, access: { has: obj => "suspend" in obj, get: obj => obj.suspend }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _delete_decorators, { kind: "method", name: "delete", static: false, private: false, access: { has: obj => "delete" in obj, get: obj => obj.delete }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AgentController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AgentController = _classThis;
})();
exports.AgentController = AgentController;
//# sourceMappingURL=agents.controller.js.map