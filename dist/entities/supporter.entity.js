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
exports.Supporter = exports.VerificationStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const registration_entity_1 = require("./registration.entity");
var VerificationStatus;
(function (VerificationStatus) {
    VerificationStatus["PENDING"] = "pending";
    VerificationStatus["VERIFIED"] = "verified";
    VerificationStatus["REJECTED"] = "rejected";
})(VerificationStatus || (exports.VerificationStatus = VerificationStatus = {}));
let Supporter = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)('supporters'), (0, typeorm_1.Index)(['email'], { unique: true }), (0, typeorm_1.Index)(['voterCardNumber']), (0, typeorm_1.Index)(['state', 'lga', 'ward'])];
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
    let _phone_decorators;
    let _phone_initializers = [];
    let _phone_extraInitializers = [];
    let _dateOfBirth_decorators;
    let _dateOfBirth_initializers = [];
    let _dateOfBirth_extraInitializers = [];
    let _gender_decorators;
    let _gender_initializers = [];
    let _gender_extraInitializers = [];
    let _occupation_decorators;
    let _occupation_initializers = [];
    let _occupation_extraInitializers = [];
    let _state_decorators;
    let _state_initializers = [];
    let _state_extraInitializers = [];
    let _lga_decorators;
    let _lga_initializers = [];
    let _lga_extraInitializers = [];
    let _ward_decorators;
    let _ward_initializers = [];
    let _ward_extraInitializers = [];
    let _pollingUnit_decorators;
    let _pollingUnit_initializers = [];
    let _pollingUnit_extraInitializers = [];
    let _address_decorators;
    let _address_initializers = [];
    let _address_extraInitializers = [];
    let _voterCardNumber_decorators;
    let _voterCardNumber_initializers = [];
    let _voterCardNumber_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _registeredByUserId_decorators;
    let _registeredByUserId_initializers = [];
    let _registeredByUserId_extraInitializers = [];
    let _registeredByUser_decorators;
    let _registeredByUser_initializers = [];
    let _registeredByUser_extraInitializers = [];
    let _verificationNotes_decorators;
    let _verificationNotes_initializers = [];
    let _verificationNotes_extraInitializers = [];
    let _verifiedByUserId_decorators;
    let _verifiedByUserId_initializers = [];
    let _verifiedByUserId_extraInitializers = [];
    let _verifiedAt_decorators;
    let _verifiedAt_initializers = [];
    let _verifiedAt_extraInitializers = [];
    let _documentUploaded_decorators;
    let _documentUploaded_initializers = [];
    let _documentUploaded_extraInitializers = [];
    let _documentUrl_decorators;
    let _documentUrl_initializers = [];
    let _documentUrl_extraInitializers = [];
    let _registeredAt_decorators;
    let _registeredAt_initializers = [];
    let _registeredAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _registrations_decorators;
    let _registrations_initializers = [];
    let _registrations_extraInitializers = [];
    var Supporter = _classThis = class {
        constructor() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.firstName = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _firstName_initializers, void 0));
            this.lastName = (__runInitializers(this, _firstName_extraInitializers), __runInitializers(this, _lastName_initializers, void 0));
            this.email = (__runInitializers(this, _lastName_extraInitializers), __runInitializers(this, _email_initializers, void 0));
            this.phone = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
            this.dateOfBirth = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _dateOfBirth_initializers, void 0));
            this.gender = (__runInitializers(this, _dateOfBirth_extraInitializers), __runInitializers(this, _gender_initializers, void 0));
            this.occupation = (__runInitializers(this, _gender_extraInitializers), __runInitializers(this, _occupation_initializers, void 0));
            this.state = (__runInitializers(this, _occupation_extraInitializers), __runInitializers(this, _state_initializers, void 0));
            this.lga = (__runInitializers(this, _state_extraInitializers), __runInitializers(this, _lga_initializers, void 0));
            this.ward = (__runInitializers(this, _lga_extraInitializers), __runInitializers(this, _ward_initializers, void 0));
            this.pollingUnit = (__runInitializers(this, _ward_extraInitializers), __runInitializers(this, _pollingUnit_initializers, void 0));
            this.address = (__runInitializers(this, _pollingUnit_extraInitializers), __runInitializers(this, _address_initializers, void 0));
            this.voterCardNumber = (__runInitializers(this, _address_extraInitializers), __runInitializers(this, _voterCardNumber_initializers, void 0));
            this.status = (__runInitializers(this, _voterCardNumber_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.registeredByUserId = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _registeredByUserId_initializers, void 0));
            this.registeredByUser = (__runInitializers(this, _registeredByUserId_extraInitializers), __runInitializers(this, _registeredByUser_initializers, void 0));
            this.verificationNotes = (__runInitializers(this, _registeredByUser_extraInitializers), __runInitializers(this, _verificationNotes_initializers, void 0));
            this.verifiedByUserId = (__runInitializers(this, _verificationNotes_extraInitializers), __runInitializers(this, _verifiedByUserId_initializers, void 0));
            this.verifiedAt = (__runInitializers(this, _verifiedByUserId_extraInitializers), __runInitializers(this, _verifiedAt_initializers, void 0));
            this.documentUploaded = (__runInitializers(this, _verifiedAt_extraInitializers), __runInitializers(this, _documentUploaded_initializers, void 0));
            this.documentUrl = (__runInitializers(this, _documentUploaded_extraInitializers), __runInitializers(this, _documentUrl_initializers, void 0));
            this.registeredAt = (__runInitializers(this, _documentUrl_extraInitializers), __runInitializers(this, _registeredAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _registeredAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.registrations = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _registrations_initializers, void 0));
            __runInitializers(this, _registrations_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Supporter");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _firstName_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255 })];
        _lastName_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255 })];
        _email_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true })];
        _phone_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 20 })];
        _dateOfBirth_decorators = [(0, typeorm_1.Column)({ type: 'date' })];
        _gender_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 50 })];
        _occupation_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255 })];
        _state_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255 })];
        _lga_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255 })];
        _ward_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255 })];
        _pollingUnit_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255 })];
        _address_decorators = [(0, typeorm_1.Column)({ type: 'text' })];
        _voterCardNumber_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true })];
        _status_decorators = [(0, typeorm_1.Column)({
                type: 'enum',
                enum: VerificationStatus,
                default: VerificationStatus.PENDING,
            })];
        _registeredByUserId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
        _registeredByUser_decorators = [(0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.registeredSupporters, {
                onDelete: 'SET NULL',
            }), (0, typeorm_1.JoinColumn)({ name: 'registeredByUserId' })];
        _verificationNotes_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _verifiedByUserId_decorators = [(0, typeorm_1.Column)({ type: 'uuid', nullable: true })];
        _verifiedAt_decorators = [(0, typeorm_1.Column)({ type: 'timestamp', nullable: true })];
        _documentUploaded_decorators = [(0, typeorm_1.Column)({ type: 'boolean', default: false })];
        _documentUrl_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true })];
        _registeredAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
        _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
        _registrations_decorators = [(0, typeorm_1.OneToMany)(() => registration_entity_1.Registration, (registration) => registration.supporter)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _firstName_decorators, { kind: "field", name: "firstName", static: false, private: false, access: { has: obj => "firstName" in obj, get: obj => obj.firstName, set: (obj, value) => { obj.firstName = value; } }, metadata: _metadata }, _firstName_initializers, _firstName_extraInitializers);
        __esDecorate(null, null, _lastName_decorators, { kind: "field", name: "lastName", static: false, private: false, access: { has: obj => "lastName" in obj, get: obj => obj.lastName, set: (obj, value) => { obj.lastName = value; } }, metadata: _metadata }, _lastName_initializers, _lastName_extraInitializers);
        __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: obj => "email" in obj, get: obj => obj.email, set: (obj, value) => { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
        __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: obj => "phone" in obj, get: obj => obj.phone, set: (obj, value) => { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
        __esDecorate(null, null, _dateOfBirth_decorators, { kind: "field", name: "dateOfBirth", static: false, private: false, access: { has: obj => "dateOfBirth" in obj, get: obj => obj.dateOfBirth, set: (obj, value) => { obj.dateOfBirth = value; } }, metadata: _metadata }, _dateOfBirth_initializers, _dateOfBirth_extraInitializers);
        __esDecorate(null, null, _gender_decorators, { kind: "field", name: "gender", static: false, private: false, access: { has: obj => "gender" in obj, get: obj => obj.gender, set: (obj, value) => { obj.gender = value; } }, metadata: _metadata }, _gender_initializers, _gender_extraInitializers);
        __esDecorate(null, null, _occupation_decorators, { kind: "field", name: "occupation", static: false, private: false, access: { has: obj => "occupation" in obj, get: obj => obj.occupation, set: (obj, value) => { obj.occupation = value; } }, metadata: _metadata }, _occupation_initializers, _occupation_extraInitializers);
        __esDecorate(null, null, _state_decorators, { kind: "field", name: "state", static: false, private: false, access: { has: obj => "state" in obj, get: obj => obj.state, set: (obj, value) => { obj.state = value; } }, metadata: _metadata }, _state_initializers, _state_extraInitializers);
        __esDecorate(null, null, _lga_decorators, { kind: "field", name: "lga", static: false, private: false, access: { has: obj => "lga" in obj, get: obj => obj.lga, set: (obj, value) => { obj.lga = value; } }, metadata: _metadata }, _lga_initializers, _lga_extraInitializers);
        __esDecorate(null, null, _ward_decorators, { kind: "field", name: "ward", static: false, private: false, access: { has: obj => "ward" in obj, get: obj => obj.ward, set: (obj, value) => { obj.ward = value; } }, metadata: _metadata }, _ward_initializers, _ward_extraInitializers);
        __esDecorate(null, null, _pollingUnit_decorators, { kind: "field", name: "pollingUnit", static: false, private: false, access: { has: obj => "pollingUnit" in obj, get: obj => obj.pollingUnit, set: (obj, value) => { obj.pollingUnit = value; } }, metadata: _metadata }, _pollingUnit_initializers, _pollingUnit_extraInitializers);
        __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: obj => "address" in obj, get: obj => obj.address, set: (obj, value) => { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
        __esDecorate(null, null, _voterCardNumber_decorators, { kind: "field", name: "voterCardNumber", static: false, private: false, access: { has: obj => "voterCardNumber" in obj, get: obj => obj.voterCardNumber, set: (obj, value) => { obj.voterCardNumber = value; } }, metadata: _metadata }, _voterCardNumber_initializers, _voterCardNumber_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _registeredByUserId_decorators, { kind: "field", name: "registeredByUserId", static: false, private: false, access: { has: obj => "registeredByUserId" in obj, get: obj => obj.registeredByUserId, set: (obj, value) => { obj.registeredByUserId = value; } }, metadata: _metadata }, _registeredByUserId_initializers, _registeredByUserId_extraInitializers);
        __esDecorate(null, null, _registeredByUser_decorators, { kind: "field", name: "registeredByUser", static: false, private: false, access: { has: obj => "registeredByUser" in obj, get: obj => obj.registeredByUser, set: (obj, value) => { obj.registeredByUser = value; } }, metadata: _metadata }, _registeredByUser_initializers, _registeredByUser_extraInitializers);
        __esDecorate(null, null, _verificationNotes_decorators, { kind: "field", name: "verificationNotes", static: false, private: false, access: { has: obj => "verificationNotes" in obj, get: obj => obj.verificationNotes, set: (obj, value) => { obj.verificationNotes = value; } }, metadata: _metadata }, _verificationNotes_initializers, _verificationNotes_extraInitializers);
        __esDecorate(null, null, _verifiedByUserId_decorators, { kind: "field", name: "verifiedByUserId", static: false, private: false, access: { has: obj => "verifiedByUserId" in obj, get: obj => obj.verifiedByUserId, set: (obj, value) => { obj.verifiedByUserId = value; } }, metadata: _metadata }, _verifiedByUserId_initializers, _verifiedByUserId_extraInitializers);
        __esDecorate(null, null, _verifiedAt_decorators, { kind: "field", name: "verifiedAt", static: false, private: false, access: { has: obj => "verifiedAt" in obj, get: obj => obj.verifiedAt, set: (obj, value) => { obj.verifiedAt = value; } }, metadata: _metadata }, _verifiedAt_initializers, _verifiedAt_extraInitializers);
        __esDecorate(null, null, _documentUploaded_decorators, { kind: "field", name: "documentUploaded", static: false, private: false, access: { has: obj => "documentUploaded" in obj, get: obj => obj.documentUploaded, set: (obj, value) => { obj.documentUploaded = value; } }, metadata: _metadata }, _documentUploaded_initializers, _documentUploaded_extraInitializers);
        __esDecorate(null, null, _documentUrl_decorators, { kind: "field", name: "documentUrl", static: false, private: false, access: { has: obj => "documentUrl" in obj, get: obj => obj.documentUrl, set: (obj, value) => { obj.documentUrl = value; } }, metadata: _metadata }, _documentUrl_initializers, _documentUrl_extraInitializers);
        __esDecorate(null, null, _registeredAt_decorators, { kind: "field", name: "registeredAt", static: false, private: false, access: { has: obj => "registeredAt" in obj, get: obj => obj.registeredAt, set: (obj, value) => { obj.registeredAt = value; } }, metadata: _metadata }, _registeredAt_initializers, _registeredAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _registrations_decorators, { kind: "field", name: "registrations", static: false, private: false, access: { has: obj => "registrations" in obj, get: obj => obj.registrations, set: (obj, value) => { obj.registrations = value; } }, metadata: _metadata }, _registrations_initializers, _registrations_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Supporter = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Supporter = _classThis;
})();
exports.Supporter = Supporter;
//# sourceMappingURL=supporter.entity.js.map