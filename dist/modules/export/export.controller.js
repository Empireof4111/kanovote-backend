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
exports.ExportController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("../../entities/user.entity");
let ExportController = (() => {
    let _classDecorators = [(0, common_1.Controller)('export'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _exportSupportersCSV_decorators;
    let _exportAgentsCSV_decorators;
    let _exportRegistrationsCSV_decorators;
    var ExportController = _classThis = class {
        constructor(exportService) {
            this.exportService = (__runInitializers(this, _instanceExtraInitializers), exportService);
        }
        async exportSupportersCSV(state, lga, status, res) {
            const csv = await this.exportService.exportSupportersCSV({ state, lga, status });
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="supporters.csv"');
            res.send(csv);
        }
        async exportAgentsCSV(state, lga, res) {
            const csv = await this.exportService.exportAgentsCSV({ state, lga });
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="agents.csv"');
            res.send(csv);
        }
        async exportRegistrationsCSV(agentId, status, res) {
            const csv = await this.exportService.exportRegistrationsCSV({ agentId, status });
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="registrations.csv"');
            res.send(csv);
        }
    };
    __setFunctionName(_classThis, "ExportController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _exportSupportersCSV_decorators = [(0, common_1.Get)('supporters-csv'), (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN)];
        _exportAgentsCSV_decorators = [(0, common_1.Get)('agents-csv'), (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN)];
        _exportRegistrationsCSV_decorators = [(0, common_1.Get)('registrations-csv'), (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN)];
        __esDecorate(_classThis, null, _exportSupportersCSV_decorators, { kind: "method", name: "exportSupportersCSV", static: false, private: false, access: { has: obj => "exportSupportersCSV" in obj, get: obj => obj.exportSupportersCSV }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _exportAgentsCSV_decorators, { kind: "method", name: "exportAgentsCSV", static: false, private: false, access: { has: obj => "exportAgentsCSV" in obj, get: obj => obj.exportAgentsCSV }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _exportRegistrationsCSV_decorators, { kind: "method", name: "exportRegistrationsCSV", static: false, private: false, access: { has: obj => "exportRegistrationsCSV" in obj, get: obj => obj.exportRegistrationsCSV }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ExportController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ExportController = _classThis;
})();
exports.ExportController = ExportController;
//# sourceMappingURL=export.controller.js.map