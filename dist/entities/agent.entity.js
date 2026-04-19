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
exports.Agent = exports.AgentStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const registration_entity_1 = require("./registration.entity");
var AgentStatus;
(function (AgentStatus) {
    AgentStatus["ACTIVE"] = "active";
    AgentStatus["INACTIVE"] = "inactive";
    AgentStatus["SUSPENDED"] = "suspended";
})(AgentStatus || (exports.AgentStatus = AgentStatus = {}));
let Agent = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)('agents'), (0, typeorm_1.Index)(['userId'], { unique: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _user_decorators;
    let _user_initializers = [];
    let _user_extraInitializers = [];
    let _role_decorators;
    let _role_initializers = [];
    let _role_extraInitializers = [];
    let _state_decorators;
    let _state_initializers = [];
    let _state_extraInitializers = [];
    let _lga_decorators;
    let _lga_initializers = [];
    let _lga_extraInitializers = [];
    let _ward_decorators;
    let _ward_initializers = [];
    let _ward_extraInitializers = [];
    let _totalRegistrations_decorators;
    let _totalRegistrations_initializers = [];
    let _totalRegistrations_extraInitializers = [];
    let _verifiedRegistrations_decorators;
    let _verifiedRegistrations_initializers = [];
    let _verifiedRegistrations_extraInitializers = [];
    let _pendingRegistrations_decorators;
    let _pendingRegistrations_initializers = [];
    let _pendingRegistrations_extraInitializers = [];
    let _rejectedRegistrations_decorators;
    let _rejectedRegistrations_initializers = [];
    let _rejectedRegistrations_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _lastActivityAt_decorators;
    let _lastActivityAt_initializers = [];
    let _lastActivityAt_extraInitializers = [];
    let _joinedAt_decorators;
    let _joinedAt_initializers = [];
    let _joinedAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _registrations_decorators;
    let _registrations_initializers = [];
    let _registrations_extraInitializers = [];
    var Agent = _classThis = class {
        constructor() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.userId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.user = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _user_initializers, void 0));
            this.role = (__runInitializers(this, _user_extraInitializers), __runInitializers(this, _role_initializers, void 0));
            this.state = (__runInitializers(this, _role_extraInitializers), __runInitializers(this, _state_initializers, void 0));
            this.lga = (__runInitializers(this, _state_extraInitializers), __runInitializers(this, _lga_initializers, void 0));
            this.ward = (__runInitializers(this, _lga_extraInitializers), __runInitializers(this, _ward_initializers, void 0));
            this.totalRegistrations = (__runInitializers(this, _ward_extraInitializers), __runInitializers(this, _totalRegistrations_initializers, void 0));
            this.verifiedRegistrations = (__runInitializers(this, _totalRegistrations_extraInitializers), __runInitializers(this, _verifiedRegistrations_initializers, void 0));
            this.pendingRegistrations = (__runInitializers(this, _verifiedRegistrations_extraInitializers), __runInitializers(this, _pendingRegistrations_initializers, void 0));
            this.rejectedRegistrations = (__runInitializers(this, _pendingRegistrations_extraInitializers), __runInitializers(this, _rejectedRegistrations_initializers, void 0));
            this.status = (__runInitializers(this, _rejectedRegistrations_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.notes = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.lastActivityAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _lastActivityAt_initializers, void 0));
            this.joinedAt = (__runInitializers(this, _lastActivityAt_extraInitializers), __runInitializers(this, _joinedAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _joinedAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.registrations = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _registrations_initializers, void 0));
            __runInitializers(this, _registrations_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Agent");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _userId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
        _user_decorators = [(0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.agents, {
                onDelete: 'CASCADE',
                eager: true,
            }), (0, typeorm_1.JoinColumn)({ name: 'userId' })];
        _role_decorators = [(0, typeorm_1.Column)({
                type: 'enum',
                enum: user_entity_1.UserRole,
                default: user_entity_1.UserRole.FIELD_AGENT,
            })];
        _state_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255 })];
        _lga_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255 })];
        _ward_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255 })];
        _totalRegistrations_decorators = [(0, typeorm_1.Column)({ type: 'int', default: 0 })];
        _verifiedRegistrations_decorators = [(0, typeorm_1.Column)({ type: 'int', default: 0 })];
        _pendingRegistrations_decorators = [(0, typeorm_1.Column)({ type: 'int', default: 0 })];
        _rejectedRegistrations_decorators = [(0, typeorm_1.Column)({ type: 'int', default: 0 })];
        _status_decorators = [(0, typeorm_1.Column)({
                type: 'enum',
                enum: AgentStatus,
                default: AgentStatus.ACTIVE,
            })];
        _notes_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _lastActivityAt_decorators = [(0, typeorm_1.Column)({ type: 'timestamp', nullable: true })];
        _joinedAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
        _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
        _registrations_decorators = [(0, typeorm_1.OneToMany)(() => registration_entity_1.Registration, (registration) => registration.agent)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _user_decorators, { kind: "field", name: "user", static: false, private: false, access: { has: obj => "user" in obj, get: obj => obj.user, set: (obj, value) => { obj.user = value; } }, metadata: _metadata }, _user_initializers, _user_extraInitializers);
        __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: obj => "role" in obj, get: obj => obj.role, set: (obj, value) => { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
        __esDecorate(null, null, _state_decorators, { kind: "field", name: "state", static: false, private: false, access: { has: obj => "state" in obj, get: obj => obj.state, set: (obj, value) => { obj.state = value; } }, metadata: _metadata }, _state_initializers, _state_extraInitializers);
        __esDecorate(null, null, _lga_decorators, { kind: "field", name: "lga", static: false, private: false, access: { has: obj => "lga" in obj, get: obj => obj.lga, set: (obj, value) => { obj.lga = value; } }, metadata: _metadata }, _lga_initializers, _lga_extraInitializers);
        __esDecorate(null, null, _ward_decorators, { kind: "field", name: "ward", static: false, private: false, access: { has: obj => "ward" in obj, get: obj => obj.ward, set: (obj, value) => { obj.ward = value; } }, metadata: _metadata }, _ward_initializers, _ward_extraInitializers);
        __esDecorate(null, null, _totalRegistrations_decorators, { kind: "field", name: "totalRegistrations", static: false, private: false, access: { has: obj => "totalRegistrations" in obj, get: obj => obj.totalRegistrations, set: (obj, value) => { obj.totalRegistrations = value; } }, metadata: _metadata }, _totalRegistrations_initializers, _totalRegistrations_extraInitializers);
        __esDecorate(null, null, _verifiedRegistrations_decorators, { kind: "field", name: "verifiedRegistrations", static: false, private: false, access: { has: obj => "verifiedRegistrations" in obj, get: obj => obj.verifiedRegistrations, set: (obj, value) => { obj.verifiedRegistrations = value; } }, metadata: _metadata }, _verifiedRegistrations_initializers, _verifiedRegistrations_extraInitializers);
        __esDecorate(null, null, _pendingRegistrations_decorators, { kind: "field", name: "pendingRegistrations", static: false, private: false, access: { has: obj => "pendingRegistrations" in obj, get: obj => obj.pendingRegistrations, set: (obj, value) => { obj.pendingRegistrations = value; } }, metadata: _metadata }, _pendingRegistrations_initializers, _pendingRegistrations_extraInitializers);
        __esDecorate(null, null, _rejectedRegistrations_decorators, { kind: "field", name: "rejectedRegistrations", static: false, private: false, access: { has: obj => "rejectedRegistrations" in obj, get: obj => obj.rejectedRegistrations, set: (obj, value) => { obj.rejectedRegistrations = value; } }, metadata: _metadata }, _rejectedRegistrations_initializers, _rejectedRegistrations_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _lastActivityAt_decorators, { kind: "field", name: "lastActivityAt", static: false, private: false, access: { has: obj => "lastActivityAt" in obj, get: obj => obj.lastActivityAt, set: (obj, value) => { obj.lastActivityAt = value; } }, metadata: _metadata }, _lastActivityAt_initializers, _lastActivityAt_extraInitializers);
        __esDecorate(null, null, _joinedAt_decorators, { kind: "field", name: "joinedAt", static: false, private: false, access: { has: obj => "joinedAt" in obj, get: obj => obj.joinedAt, set: (obj, value) => { obj.joinedAt = value; } }, metadata: _metadata }, _joinedAt_initializers, _joinedAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _registrations_decorators, { kind: "field", name: "registrations", static: false, private: false, access: { has: obj => "registrations" in obj, get: obj => obj.registrations, set: (obj, value) => { obj.registrations = value; } }, metadata: _metadata }, _registrations_initializers, _registrations_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Agent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Agent = _classThis;
})();
exports.Agent = Agent;
//# sourceMappingURL=agent.entity.js.map