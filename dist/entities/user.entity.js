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
exports.User = exports.UserRole = void 0;
const typeorm_1 = require("typeorm");
const agent_entity_1 = require("./agent.entity");
const supporter_entity_1 = require("./supporter.entity");
const activity_log_entity_1 = require("./activity-log.entity");
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "super_admin";
    UserRole["SUPERVISOR"] = "supervisor";
    UserRole["FIELD_AGENT"] = "field_agent";
})(UserRole || (exports.UserRole = UserRole = {}));
let User = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)('users'), (0, typeorm_1.Index)(['email'], { unique: true }), (0, typeorm_1.Index)(['username'], { unique: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _firstName_decorators;
    let _firstName_initializers = [];
    let _firstName_extraInitializers = [];
    let _lastName_decorators;
    let _lastName_initializers = [];
    let _lastName_extraInitializers = [];
    let _email_decorators;
    let _email_initializers = [];
    let _email_extraInitializers = [];
    let _username_decorators;
    let _username_initializers = [];
    let _username_extraInitializers = [];
    let _password_decorators;
    let _password_initializers = [];
    let _password_extraInitializers = [];
    let _role_decorators;
    let _role_initializers = [];
    let _role_extraInitializers = [];
    let _phone_decorators;
    let _phone_initializers = [];
    let _phone_extraInitializers = [];
    let _profileImage_decorators;
    let _profileImage_initializers = [];
    let _profileImage_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _isEmailVerified_decorators;
    let _isEmailVerified_initializers = [];
    let _isEmailVerified_extraInitializers = [];
    let _emailVerificationToken_decorators;
    let _emailVerificationToken_initializers = [];
    let _emailVerificationToken_extraInitializers = [];
    let _emailVerifiedAt_decorators;
    let _emailVerifiedAt_initializers = [];
    let _emailVerifiedAt_extraInitializers = [];
    let _resetPasswordToken_decorators;
    let _resetPasswordToken_initializers = [];
    let _resetPasswordToken_extraInitializers = [];
    let _resetPasswordTokenExpiry_decorators;
    let _resetPasswordTokenExpiry_initializers = [];
    let _resetPasswordTokenExpiry_extraInitializers = [];
    let _lastLoginAt_decorators;
    let _lastLoginAt_initializers = [];
    let _lastLoginAt_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _agents_decorators;
    let _agents_initializers = [];
    let _agents_extraInitializers = [];
    let _registeredSupporters_decorators;
    let _registeredSupporters_initializers = [];
    let _registeredSupporters_extraInitializers = [];
    let _activityLogs_decorators;
    let _activityLogs_initializers = [];
    let _activityLogs_extraInitializers = [];
    var User = _classThis = class {
        constructor() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.firstName = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _firstName_initializers, void 0));
            this.lastName = (__runInitializers(this, _firstName_extraInitializers), __runInitializers(this, _lastName_initializers, void 0));
            this.email = (__runInitializers(this, _lastName_extraInitializers), __runInitializers(this, _email_initializers, void 0));
            this.username = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _username_initializers, void 0));
            this.password = (__runInitializers(this, _username_extraInitializers), __runInitializers(this, _password_initializers, void 0));
            this.role = (__runInitializers(this, _password_extraInitializers), __runInitializers(this, _role_initializers, void 0));
            this.phone = (__runInitializers(this, _role_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
            this.profileImage = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _profileImage_initializers, void 0));
            this.isActive = (__runInitializers(this, _profileImage_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.isEmailVerified = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _isEmailVerified_initializers, void 0));
            this.emailVerificationToken = (__runInitializers(this, _isEmailVerified_extraInitializers), __runInitializers(this, _emailVerificationToken_initializers, void 0));
            this.emailVerifiedAt = (__runInitializers(this, _emailVerificationToken_extraInitializers), __runInitializers(this, _emailVerifiedAt_initializers, void 0));
            this.resetPasswordToken = (__runInitializers(this, _emailVerifiedAt_extraInitializers), __runInitializers(this, _resetPasswordToken_initializers, void 0));
            this.resetPasswordTokenExpiry = (__runInitializers(this, _resetPasswordToken_extraInitializers), __runInitializers(this, _resetPasswordTokenExpiry_initializers, void 0));
            this.lastLoginAt = (__runInitializers(this, _resetPasswordTokenExpiry_extraInitializers), __runInitializers(this, _lastLoginAt_initializers, void 0));
            this.createdAt = (__runInitializers(this, _lastLoginAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.agents = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _agents_initializers, void 0));
            this.registeredSupporters = (__runInitializers(this, _agents_extraInitializers), __runInitializers(this, _registeredSupporters_initializers, void 0));
            this.activityLogs = (__runInitializers(this, _registeredSupporters_extraInitializers), __runInitializers(this, _activityLogs_initializers, void 0));
            __runInitializers(this, _activityLogs_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "User");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _firstName_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255 })];
        _lastName_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255 })];
        _email_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true })];
        _username_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true })];
        _password_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255 })];
        _role_decorators = [(0, typeorm_1.Column)({
                type: 'enum',
                enum: UserRole,
                default: UserRole.FIELD_AGENT,
            })];
        _phone_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true })];
        _profileImage_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true })];
        _isActive_decorators = [(0, typeorm_1.Column)({ type: 'boolean', default: true })];
        _isEmailVerified_decorators = [(0, typeorm_1.Column)({ type: 'boolean', default: false })];
        _emailVerificationToken_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true })];
        _emailVerifiedAt_decorators = [(0, typeorm_1.Column)({ type: 'timestamp', nullable: true })];
        _resetPasswordToken_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true })];
        _resetPasswordTokenExpiry_decorators = [(0, typeorm_1.Column)({ type: 'timestamp', nullable: true })];
        _lastLoginAt_decorators = [(0, typeorm_1.Column)({ type: 'timestamp', nullable: true })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
        _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
        _agents_decorators = [(0, typeorm_1.OneToMany)(() => agent_entity_1.Agent, (agent) => agent.user, { nullable: true })];
        _registeredSupporters_decorators = [(0, typeorm_1.OneToMany)(() => supporter_entity_1.Supporter, (supporter) => supporter.registeredByUser)];
        _activityLogs_decorators = [(0, typeorm_1.OneToMany)(() => activity_log_entity_1.ActivityLog, (log) => log.user)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _firstName_decorators, { kind: "field", name: "firstName", static: false, private: false, access: { has: obj => "firstName" in obj, get: obj => obj.firstName, set: (obj, value) => { obj.firstName = value; } }, metadata: _metadata }, _firstName_initializers, _firstName_extraInitializers);
        __esDecorate(null, null, _lastName_decorators, { kind: "field", name: "lastName", static: false, private: false, access: { has: obj => "lastName" in obj, get: obj => obj.lastName, set: (obj, value) => { obj.lastName = value; } }, metadata: _metadata }, _lastName_initializers, _lastName_extraInitializers);
        __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: obj => "email" in obj, get: obj => obj.email, set: (obj, value) => { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
        __esDecorate(null, null, _username_decorators, { kind: "field", name: "username", static: false, private: false, access: { has: obj => "username" in obj, get: obj => obj.username, set: (obj, value) => { obj.username = value; } }, metadata: _metadata }, _username_initializers, _username_extraInitializers);
        __esDecorate(null, null, _password_decorators, { kind: "field", name: "password", static: false, private: false, access: { has: obj => "password" in obj, get: obj => obj.password, set: (obj, value) => { obj.password = value; } }, metadata: _metadata }, _password_initializers, _password_extraInitializers);
        __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: obj => "role" in obj, get: obj => obj.role, set: (obj, value) => { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
        __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: obj => "phone" in obj, get: obj => obj.phone, set: (obj, value) => { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
        __esDecorate(null, null, _profileImage_decorators, { kind: "field", name: "profileImage", static: false, private: false, access: { has: obj => "profileImage" in obj, get: obj => obj.profileImage, set: (obj, value) => { obj.profileImage = value; } }, metadata: _metadata }, _profileImage_initializers, _profileImage_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _isEmailVerified_decorators, { kind: "field", name: "isEmailVerified", static: false, private: false, access: { has: obj => "isEmailVerified" in obj, get: obj => obj.isEmailVerified, set: (obj, value) => { obj.isEmailVerified = value; } }, metadata: _metadata }, _isEmailVerified_initializers, _isEmailVerified_extraInitializers);
        __esDecorate(null, null, _emailVerificationToken_decorators, { kind: "field", name: "emailVerificationToken", static: false, private: false, access: { has: obj => "emailVerificationToken" in obj, get: obj => obj.emailVerificationToken, set: (obj, value) => { obj.emailVerificationToken = value; } }, metadata: _metadata }, _emailVerificationToken_initializers, _emailVerificationToken_extraInitializers);
        __esDecorate(null, null, _emailVerifiedAt_decorators, { kind: "field", name: "emailVerifiedAt", static: false, private: false, access: { has: obj => "emailVerifiedAt" in obj, get: obj => obj.emailVerifiedAt, set: (obj, value) => { obj.emailVerifiedAt = value; } }, metadata: _metadata }, _emailVerifiedAt_initializers, _emailVerifiedAt_extraInitializers);
        __esDecorate(null, null, _resetPasswordToken_decorators, { kind: "field", name: "resetPasswordToken", static: false, private: false, access: { has: obj => "resetPasswordToken" in obj, get: obj => obj.resetPasswordToken, set: (obj, value) => { obj.resetPasswordToken = value; } }, metadata: _metadata }, _resetPasswordToken_initializers, _resetPasswordToken_extraInitializers);
        __esDecorate(null, null, _resetPasswordTokenExpiry_decorators, { kind: "field", name: "resetPasswordTokenExpiry", static: false, private: false, access: { has: obj => "resetPasswordTokenExpiry" in obj, get: obj => obj.resetPasswordTokenExpiry, set: (obj, value) => { obj.resetPasswordTokenExpiry = value; } }, metadata: _metadata }, _resetPasswordTokenExpiry_initializers, _resetPasswordTokenExpiry_extraInitializers);
        __esDecorate(null, null, _lastLoginAt_decorators, { kind: "field", name: "lastLoginAt", static: false, private: false, access: { has: obj => "lastLoginAt" in obj, get: obj => obj.lastLoginAt, set: (obj, value) => { obj.lastLoginAt = value; } }, metadata: _metadata }, _lastLoginAt_initializers, _lastLoginAt_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _agents_decorators, { kind: "field", name: "agents", static: false, private: false, access: { has: obj => "agents" in obj, get: obj => obj.agents, set: (obj, value) => { obj.agents = value; } }, metadata: _metadata }, _agents_initializers, _agents_extraInitializers);
        __esDecorate(null, null, _registeredSupporters_decorators, { kind: "field", name: "registeredSupporters", static: false, private: false, access: { has: obj => "registeredSupporters" in obj, get: obj => obj.registeredSupporters, set: (obj, value) => { obj.registeredSupporters = value; } }, metadata: _metadata }, _registeredSupporters_initializers, _registeredSupporters_extraInitializers);
        __esDecorate(null, null, _activityLogs_decorators, { kind: "field", name: "activityLogs", static: false, private: false, access: { has: obj => "activityLogs" in obj, get: obj => obj.activityLogs, set: (obj, value) => { obj.activityLogs = value; } }, metadata: _metadata }, _activityLogs_initializers, _activityLogs_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        User = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return User = _classThis;
})();
exports.User = User;
//# sourceMappingURL=user.entity.js.map