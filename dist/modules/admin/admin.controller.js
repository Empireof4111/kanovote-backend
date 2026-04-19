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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("../../entities/user.entity");
let AdminController = (() => {
    let _classDecorators = [(0, common_1.Controller)('admin'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getDashboard_decorators;
    let _getAllUsers_decorators;
    let _getUserStats_decorators;
    let _getAgentStats_decorators;
    let _updateUserRole_decorators;
    let _blockUser_decorators;
    let _unblockUser_decorators;
    var AdminController = _classThis = class {
        constructor(adminService) {
            this.adminService = (__runInitializers(this, _instanceExtraInitializers), adminService);
        }
        async getDashboard() {
            return this.adminService.getDashboardStats();
        }
        async getAllUsers(skip = '0', take = '10', role) {
            const [users, total] = await this.adminService.getAllUsers(parseInt(skip), parseInt(take), role);
            return { users, total };
        }
        async getUserStats() {
            return this.adminService.getUserStats();
        }
        async getAgentStats() {
            return this.adminService.getAgentStats();
        }
        async updateUserRole(userId, { role }) {
            return this.adminService.updateUserRole(userId, role);
        }
        async blockUser(userId) {
            return this.adminService.blockUser(userId);
        }
        async unblockUser(userId) {
            return this.adminService.unblockUser(userId);
        }
    };
    __setFunctionName(_classThis, "AdminController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getDashboard_decorators = [(0, common_1.Get)('dashboard')];
        _getAllUsers_decorators = [(0, common_1.Get)('users')];
        _getUserStats_decorators = [(0, common_1.Get)('users/stats')];
        _getAgentStats_decorators = [(0, common_1.Get)('agents/stats')];
        _updateUserRole_decorators = [(0, common_1.Put)('users/:id/role')];
        _blockUser_decorators = [(0, common_1.Put)('users/:id/block'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
        _unblockUser_decorators = [(0, common_1.Put)('users/:id/unblock'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
        __esDecorate(_classThis, null, _getDashboard_decorators, { kind: "method", name: "getDashboard", static: false, private: false, access: { has: obj => "getDashboard" in obj, get: obj => obj.getDashboard }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAllUsers_decorators, { kind: "method", name: "getAllUsers", static: false, private: false, access: { has: obj => "getAllUsers" in obj, get: obj => obj.getAllUsers }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getUserStats_decorators, { kind: "method", name: "getUserStats", static: false, private: false, access: { has: obj => "getUserStats" in obj, get: obj => obj.getUserStats }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAgentStats_decorators, { kind: "method", name: "getAgentStats", static: false, private: false, access: { has: obj => "getAgentStats" in obj, get: obj => obj.getAgentStats }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateUserRole_decorators, { kind: "method", name: "updateUserRole", static: false, private: false, access: { has: obj => "updateUserRole" in obj, get: obj => obj.updateUserRole }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _blockUser_decorators, { kind: "method", name: "blockUser", static: false, private: false, access: { has: obj => "blockUser" in obj, get: obj => obj.blockUser }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _unblockUser_decorators, { kind: "method", name: "unblockUser", static: false, private: false, access: { has: obj => "unblockUser" in obj, get: obj => obj.unblockUser }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminController = _classThis;
})();
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map