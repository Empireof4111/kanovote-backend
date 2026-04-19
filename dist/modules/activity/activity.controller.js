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
exports.ActivityController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("../../entities/user.entity");
let ActivityController = (() => {
    let _classDecorators = [(0, common_1.Controller)('activity'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getRecentActivity_decorators;
    let _getAuditLog_decorators;
    let _findByUser_decorators;
    let _findByEntity_decorators;
    var ActivityController = _classThis = class {
        constructor(activityService) {
            this.activityService = (__runInitializers(this, _instanceExtraInitializers), activityService);
        }
        async getRecentActivity(limit = '20') {
            return this.activityService.getRecentActivity(parseInt(limit));
        }
        async getAuditLog(skip = '0', take = '10', userId, action) {
            const [logs, total] = await this.activityService.getAuditLog(parseInt(skip), parseInt(take), { userId, action });
            return { logs, total };
        }
        async findByUser(userId, skip = '0', take = '10') {
            const [logs, total] = await this.activityService.findByUser(userId, parseInt(skip), parseInt(take));
            return { logs, total };
        }
        async findByEntity(entityType, entityId) {
            return this.activityService.findByEntity(entityType, entityId);
        }
    };
    __setFunctionName(_classThis, "ActivityController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getRecentActivity_decorators = [(0, common_1.Get)('recent'), (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN)];
        _getAuditLog_decorators = [(0, common_1.Get)('audit-log'), (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN)];
        _findByUser_decorators = [(0, common_1.Get)('user/:userId'), (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN)];
        _findByEntity_decorators = [(0, common_1.Get)('entity/:entityType/:entityId'), (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN)];
        __esDecorate(_classThis, null, _getRecentActivity_decorators, { kind: "method", name: "getRecentActivity", static: false, private: false, access: { has: obj => "getRecentActivity" in obj, get: obj => obj.getRecentActivity }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAuditLog_decorators, { kind: "method", name: "getAuditLog", static: false, private: false, access: { has: obj => "getAuditLog" in obj, get: obj => obj.getAuditLog }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findByUser_decorators, { kind: "method", name: "findByUser", static: false, private: false, access: { has: obj => "findByUser" in obj, get: obj => obj.findByUser }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findByEntity_decorators, { kind: "method", name: "findByEntity", static: false, private: false, access: { has: obj => "findByEntity" in obj, get: obj => obj.findByEntity }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ActivityController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ActivityController = _classThis;
})();
exports.ActivityController = ActivityController;
//# sourceMappingURL=activity.controller.js.map