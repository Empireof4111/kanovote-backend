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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifySupporterDto = exports.UpdateSupporterDto = exports.CreateSupporterDto = void 0;
const class_validator_1 = require("class-validator");
const supporter_entity_1 = require("../../../entities/supporter.entity");
let CreateSupporterDto = (() => {
    var _a;
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
    return _a = class CreateSupporterDto {
            constructor() {
                this.firstName = __runInitializers(this, _firstName_initializers, void 0);
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
                __runInitializers(this, _voterCardNumber_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _firstName_decorators = [(0, class_validator_1.IsString)()];
            _lastName_decorators = [(0, class_validator_1.IsString)()];
            _email_decorators = [(0, class_validator_1.IsEmail)()];
            _phone_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsPhoneNumber)('NG')];
            _dateOfBirth_decorators = [(0, class_validator_1.IsDateString)()];
            _gender_decorators = [(0, class_validator_1.IsString)()];
            _occupation_decorators = [(0, class_validator_1.IsString)()];
            _state_decorators = [(0, class_validator_1.IsString)()];
            _lga_decorators = [(0, class_validator_1.IsString)()];
            _ward_decorators = [(0, class_validator_1.IsString)()];
            _pollingUnit_decorators = [(0, class_validator_1.IsString)()];
            _address_decorators = [(0, class_validator_1.IsString)()];
            _voterCardNumber_decorators = [(0, class_validator_1.IsString)()];
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
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateSupporterDto = CreateSupporterDto;
let UpdateSupporterDto = (() => {
    var _a;
    let _occupation_decorators;
    let _occupation_initializers = [];
    let _occupation_extraInitializers = [];
    let _pollingUnit_decorators;
    let _pollingUnit_initializers = [];
    let _pollingUnit_extraInitializers = [];
    let _address_decorators;
    let _address_initializers = [];
    let _address_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _verificationNotes_decorators;
    let _verificationNotes_initializers = [];
    let _verificationNotes_extraInitializers = [];
    return _a = class UpdateSupporterDto {
            constructor() {
                this.occupation = __runInitializers(this, _occupation_initializers, void 0);
                this.pollingUnit = (__runInitializers(this, _occupation_extraInitializers), __runInitializers(this, _pollingUnit_initializers, void 0));
                this.address = (__runInitializers(this, _pollingUnit_extraInitializers), __runInitializers(this, _address_initializers, void 0));
                this.status = (__runInitializers(this, _address_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.verificationNotes = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _verificationNotes_initializers, void 0));
                __runInitializers(this, _verificationNotes_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _occupation_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _pollingUnit_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _address_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _status_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(supporter_entity_1.VerificationStatus)];
            _verificationNotes_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _occupation_decorators, { kind: "field", name: "occupation", static: false, private: false, access: { has: obj => "occupation" in obj, get: obj => obj.occupation, set: (obj, value) => { obj.occupation = value; } }, metadata: _metadata }, _occupation_initializers, _occupation_extraInitializers);
            __esDecorate(null, null, _pollingUnit_decorators, { kind: "field", name: "pollingUnit", static: false, private: false, access: { has: obj => "pollingUnit" in obj, get: obj => obj.pollingUnit, set: (obj, value) => { obj.pollingUnit = value; } }, metadata: _metadata }, _pollingUnit_initializers, _pollingUnit_extraInitializers);
            __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: obj => "address" in obj, get: obj => obj.address, set: (obj, value) => { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _verificationNotes_decorators, { kind: "field", name: "verificationNotes", static: false, private: false, access: { has: obj => "verificationNotes" in obj, get: obj => obj.verificationNotes, set: (obj, value) => { obj.verificationNotes = value; } }, metadata: _metadata }, _verificationNotes_initializers, _verificationNotes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateSupporterDto = UpdateSupporterDto;
let VerifySupporterDto = (() => {
    var _a;
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    return _a = class VerifySupporterDto {
            constructor() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                this.notes = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                __runInitializers(this, _notes_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, class_validator_1.IsEnum)(supporter_entity_1.VerificationStatus)];
            _notes_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.VerifySupporterDto = VerifySupporterDto;
//# sourceMappingURL=index.js.map