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
exports.Registration = exports.RegistrationStatus = void 0;
const typeorm_1 = require("typeorm");
const agent_entity_1 = require("./agent.entity");
const supporter_entity_1 = require("./supporter.entity");
var RegistrationStatus;
(function (RegistrationStatus) {
    RegistrationStatus["INITIATED"] = "initiated";
    RegistrationStatus["IN_PROGRESS"] = "in_progress";
    RegistrationStatus["COMPLETED"] = "completed";
    RegistrationStatus["VERIFIED"] = "verified";
    RegistrationStatus["REJECTED"] = "rejected";
})(RegistrationStatus || (exports.RegistrationStatus = RegistrationStatus = {}));
let Registration = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)('registrations'), (0, typeorm_1.Index)(['agentId']), (0, typeorm_1.Index)(['supporterId']), (0, typeorm_1.Index)(['status']), (0, typeorm_1.Index)(['createdAt'])];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _agentId_decorators;
    let _agentId_initializers = [];
    let _agentId_extraInitializers = [];
    let _agent_decorators;
    let _agent_initializers = [];
    let _agent_extraInitializers = [];
    let _supporterId_decorators;
    let _supporterId_initializers = [];
    let _supporterId_extraInitializers = [];
    let _supporter_decorators;
    let _supporter_initializers = [];
    let _supporter_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _completionPercentage_decorators;
    let _completionPercentage_initializers = [];
    let _completionPercentage_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _verifiedByUserId_decorators;
    let _verifiedByUserId_initializers = [];
    let _verifiedByUserId_extraInitializers = [];
    let _verifiedAt_decorators;
    let _verifiedAt_initializers = [];
    let _verifiedAt_extraInitializers = [];
    let _completedAt_decorators;
    let _completedAt_initializers = [];
    let _completedAt_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var Registration = _classThis = class {
        constructor() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.agentId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _agentId_initializers, void 0));
            this.agent = (__runInitializers(this, _agentId_extraInitializers), __runInitializers(this, _agent_initializers, void 0));
            this.supporterId = (__runInitializers(this, _agent_extraInitializers), __runInitializers(this, _supporterId_initializers, void 0));
            this.supporter = (__runInitializers(this, _supporterId_extraInitializers), __runInitializers(this, _supporter_initializers, void 0));
            this.status = (__runInitializers(this, _supporter_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.completionPercentage = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _completionPercentage_initializers, void 0));
            this.notes = (__runInitializers(this, _completionPercentage_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.verifiedByUserId = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _verifiedByUserId_initializers, void 0));
            this.verifiedAt = (__runInitializers(this, _verifiedByUserId_extraInitializers), __runInitializers(this, _verifiedAt_initializers, void 0));
            this.completedAt = (__runInitializers(this, _verifiedAt_extraInitializers), __runInitializers(this, _completedAt_initializers, void 0));
            this.createdAt = (__runInitializers(this, _completedAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Registration");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _agentId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
        _agent_decorators = [(0, typeorm_1.ManyToOne)(() => agent_entity_1.Agent, (agent) => agent.registrations, {
                onDelete: 'SET NULL',
            }), (0, typeorm_1.JoinColumn)({ name: 'agentId' })];
        _supporterId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
        _supporter_decorators = [(0, typeorm_1.ManyToOne)(() => supporter_entity_1.Supporter, (supporter) => supporter.registrations, {
                onDelete: 'CASCADE',
                eager: true,
            }), (0, typeorm_1.JoinColumn)({ name: 'supporterId' })];
        _status_decorators = [(0, typeorm_1.Column)({
                type: 'enum',
                enum: RegistrationStatus,
                default: RegistrationStatus.INITIATED,
            })];
        _completionPercentage_decorators = [(0, typeorm_1.Column)({ type: 'int', default: 0 })];
        _notes_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _verifiedByUserId_decorators = [(0, typeorm_1.Column)({ type: 'uuid', nullable: true })];
        _verifiedAt_decorators = [(0, typeorm_1.Column)({ type: 'timestamp', nullable: true })];
        _completedAt_decorators = [(0, typeorm_1.Column)({ type: 'timestamp', nullable: true })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
        _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _agentId_decorators, { kind: "field", name: "agentId", static: false, private: false, access: { has: obj => "agentId" in obj, get: obj => obj.agentId, set: (obj, value) => { obj.agentId = value; } }, metadata: _metadata }, _agentId_initializers, _agentId_extraInitializers);
        __esDecorate(null, null, _agent_decorators, { kind: "field", name: "agent", static: false, private: false, access: { has: obj => "agent" in obj, get: obj => obj.agent, set: (obj, value) => { obj.agent = value; } }, metadata: _metadata }, _agent_initializers, _agent_extraInitializers);
        __esDecorate(null, null, _supporterId_decorators, { kind: "field", name: "supporterId", static: false, private: false, access: { has: obj => "supporterId" in obj, get: obj => obj.supporterId, set: (obj, value) => { obj.supporterId = value; } }, metadata: _metadata }, _supporterId_initializers, _supporterId_extraInitializers);
        __esDecorate(null, null, _supporter_decorators, { kind: "field", name: "supporter", static: false, private: false, access: { has: obj => "supporter" in obj, get: obj => obj.supporter, set: (obj, value) => { obj.supporter = value; } }, metadata: _metadata }, _supporter_initializers, _supporter_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _completionPercentage_decorators, { kind: "field", name: "completionPercentage", static: false, private: false, access: { has: obj => "completionPercentage" in obj, get: obj => obj.completionPercentage, set: (obj, value) => { obj.completionPercentage = value; } }, metadata: _metadata }, _completionPercentage_initializers, _completionPercentage_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _verifiedByUserId_decorators, { kind: "field", name: "verifiedByUserId", static: false, private: false, access: { has: obj => "verifiedByUserId" in obj, get: obj => obj.verifiedByUserId, set: (obj, value) => { obj.verifiedByUserId = value; } }, metadata: _metadata }, _verifiedByUserId_initializers, _verifiedByUserId_extraInitializers);
        __esDecorate(null, null, _verifiedAt_decorators, { kind: "field", name: "verifiedAt", static: false, private: false, access: { has: obj => "verifiedAt" in obj, get: obj => obj.verifiedAt, set: (obj, value) => { obj.verifiedAt = value; } }, metadata: _metadata }, _verifiedAt_initializers, _verifiedAt_extraInitializers);
        __esDecorate(null, null, _completedAt_decorators, { kind: "field", name: "completedAt", static: false, private: false, access: { has: obj => "completedAt" in obj, get: obj => obj.completedAt, set: (obj, value) => { obj.completedAt = value; } }, metadata: _metadata }, _completedAt_initializers, _completedAt_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Registration = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Registration = _classThis;
})();
exports.Registration = Registration;
//# sourceMappingURL=registration.entity.js.map