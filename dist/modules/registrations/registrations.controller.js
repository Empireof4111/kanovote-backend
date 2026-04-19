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
exports.RegistrationController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("../../entities/user.entity");
let RegistrationController = (() => {
    let _classDecorators = [(0, common_1.Controller)('registrations'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _create_decorators;
    let _getStatistics_decorators;
    let _findById_decorators;
    let _findByAgent_decorators;
    let _findBySupporter_decorators;
    let _updateStatus_decorators;
    var RegistrationController = _classThis = class {
        constructor(registrationService) {
            this.registrationService = (__runInitializers(this, _instanceExtraInitializers), registrationService);
        }
        async create({ agentId, supporterId }) {
            return this.registrationService.create(agentId, supporterId);
        }
        async getStatistics() {
            return this.registrationService.getRegistrationStats();
        }
        async findById(id) {
            return this.registrationService.findById(id);
        }
        async findByAgent(agentId, skip = '0', take = '10') {
            const [registrations, total] = await this.registrationService.findByAgentId(agentId, parseInt(skip), parseInt(take));
            return { registrations, total };
        }
        async findBySupporter(supporterId) {
            return this.registrationService.findBySupporterId(supporterId);
        }
        async updateStatus(id, { status }) {
            return this.registrationService.updateStatus(id, status);
        }
    };
    __setFunctionName(_classThis, "RegistrationController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, roles_decorator_1.Roles)(user_entity_1.UserRole.FIELD_AGENT), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED)];
        _getStatistics_decorators = [(0, common_1.Get)('statistics'), (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN)];
        _findById_decorators = [(0, common_1.Get)(':id'), (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.SUPERVISOR, user_entity_1.UserRole.FIELD_AGENT)];
        _findByAgent_decorators = [(0, common_1.Get)('agent/:agentId'), (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPERVISOR, user_entity_1.UserRole.FIELD_AGENT)];
        _findBySupporter_decorators = [(0, common_1.Get)('supporter/:supporterId'), (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN)];
        _updateStatus_decorators = [(0, common_1.Put)(':id/status'), (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.SUPERVISOR)];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: obj => "create" in obj, get: obj => obj.create }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getStatistics_decorators, { kind: "method", name: "getStatistics", static: false, private: false, access: { has: obj => "getStatistics" in obj, get: obj => obj.getStatistics }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findById_decorators, { kind: "method", name: "findById", static: false, private: false, access: { has: obj => "findById" in obj, get: obj => obj.findById }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findByAgent_decorators, { kind: "method", name: "findByAgent", static: false, private: false, access: { has: obj => "findByAgent" in obj, get: obj => obj.findByAgent }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findBySupporter_decorators, { kind: "method", name: "findBySupporter", static: false, private: false, access: { has: obj => "findBySupporter" in obj, get: obj => obj.findBySupporter }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateStatus_decorators, { kind: "method", name: "updateStatus", static: false, private: false, access: { has: obj => "updateStatus" in obj, get: obj => obj.updateStatus }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RegistrationController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RegistrationController = _classThis;
})();
exports.RegistrationController = RegistrationController;
//# sourceMappingURL=registrations.controller.js.map