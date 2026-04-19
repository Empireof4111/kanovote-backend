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
exports.AgentPerformanceDto = exports.UpdateAgentDto = exports.CreateAgentDto = void 0;
const class_validator_1 = require("class-validator");
const user_entity_1 = require("../../../entities/user.entity");
const agent_entity_1 = require("../../../entities/agent.entity");
let CreateAgentDto = (() => {
    var _a;
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
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
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    return _a = class CreateAgentDto {
            constructor() {
                this.userId = __runInitializers(this, _userId_initializers, void 0);
                this.role = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _role_initializers, void 0));
                this.state = (__runInitializers(this, _role_extraInitializers), __runInitializers(this, _state_initializers, void 0));
                this.lga = (__runInitializers(this, _state_extraInitializers), __runInitializers(this, _lga_initializers, void 0));
                this.ward = (__runInitializers(this, _lga_extraInitializers), __runInitializers(this, _ward_initializers, void 0));
                this.notes = (__runInitializers(this, _ward_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                __runInitializers(this, _notes_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _userId_decorators = [(0, class_validator_1.IsString)()];
            _role_decorators = [(0, class_validator_1.IsEnum)(user_entity_1.UserRole)];
            _state_decorators = [(0, class_validator_1.IsString)()];
            _lga_decorators = [(0, class_validator_1.IsString)()];
            _ward_decorators = [(0, class_validator_1.IsString)()];
            _notes_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: obj => "role" in obj, get: obj => obj.role, set: (obj, value) => { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
            __esDecorate(null, null, _state_decorators, { kind: "field", name: "state", static: false, private: false, access: { has: obj => "state" in obj, get: obj => obj.state, set: (obj, value) => { obj.state = value; } }, metadata: _metadata }, _state_initializers, _state_extraInitializers);
            __esDecorate(null, null, _lga_decorators, { kind: "field", name: "lga", static: false, private: false, access: { has: obj => "lga" in obj, get: obj => obj.lga, set: (obj, value) => { obj.lga = value; } }, metadata: _metadata }, _lga_initializers, _lga_extraInitializers);
            __esDecorate(null, null, _ward_decorators, { kind: "field", name: "ward", static: false, private: false, access: { has: obj => "ward" in obj, get: obj => obj.ward, set: (obj, value) => { obj.ward = value; } }, metadata: _metadata }, _ward_initializers, _ward_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateAgentDto = CreateAgentDto;
let UpdateAgentDto = (() => {
    var _a;
    let _state_decorators;
    let _state_initializers = [];
    let _state_extraInitializers = [];
    let _lga_decorators;
    let _lga_initializers = [];
    let _lga_extraInitializers = [];
    let _ward_decorators;
    let _ward_initializers = [];
    let _ward_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    return _a = class UpdateAgentDto {
            constructor() {
                this.state = __runInitializers(this, _state_initializers, void 0);
                this.lga = (__runInitializers(this, _state_extraInitializers), __runInitializers(this, _lga_initializers, void 0));
                this.ward = (__runInitializers(this, _lga_extraInitializers), __runInitializers(this, _ward_initializers, void 0));
                this.status = (__runInitializers(this, _ward_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.notes = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                __runInitializers(this, _notes_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _state_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _lga_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _ward_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _status_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(agent_entity_1.AgentStatus)];
            _notes_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _state_decorators, { kind: "field", name: "state", static: false, private: false, access: { has: obj => "state" in obj, get: obj => obj.state, set: (obj, value) => { obj.state = value; } }, metadata: _metadata }, _state_initializers, _state_extraInitializers);
            __esDecorate(null, null, _lga_decorators, { kind: "field", name: "lga", static: false, private: false, access: { has: obj => "lga" in obj, get: obj => obj.lga, set: (obj, value) => { obj.lga = value; } }, metadata: _metadata }, _lga_initializers, _lga_extraInitializers);
            __esDecorate(null, null, _ward_decorators, { kind: "field", name: "ward", static: false, private: false, access: { has: obj => "ward" in obj, get: obj => obj.ward, set: (obj, value) => { obj.ward = value; } }, metadata: _metadata }, _ward_initializers, _ward_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateAgentDto = UpdateAgentDto;
let AgentPerformanceDto = (() => {
    var _a;
    let _skip_decorators;
    let _skip_initializers = [];
    let _skip_extraInitializers = [];
    let _take_decorators;
    let _take_initializers = [];
    let _take_extraInitializers = [];
    let _state_decorators;
    let _state_initializers = [];
    let _state_extraInitializers = [];
    let _lga_decorators;
    let _lga_initializers = [];
    let _lga_extraInitializers = [];
    return _a = class AgentPerformanceDto {
            constructor() {
                this.skip = __runInitializers(this, _skip_initializers, void 0);
                this.take = (__runInitializers(this, _skip_extraInitializers), __runInitializers(this, _take_initializers, void 0));
                this.state = (__runInitializers(this, _take_extraInitializers), __runInitializers(this, _state_initializers, void 0));
                this.lga = (__runInitializers(this, _state_extraInitializers), __runInitializers(this, _lga_initializers, void 0));
                __runInitializers(this, _lga_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _skip_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            _take_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1)];
            _state_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _lga_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _skip_decorators, { kind: "field", name: "skip", static: false, private: false, access: { has: obj => "skip" in obj, get: obj => obj.skip, set: (obj, value) => { obj.skip = value; } }, metadata: _metadata }, _skip_initializers, _skip_extraInitializers);
            __esDecorate(null, null, _take_decorators, { kind: "field", name: "take", static: false, private: false, access: { has: obj => "take" in obj, get: obj => obj.take, set: (obj, value) => { obj.take = value; } }, metadata: _metadata }, _take_initializers, _take_extraInitializers);
            __esDecorate(null, null, _state_decorators, { kind: "field", name: "state", static: false, private: false, access: { has: obj => "state" in obj, get: obj => obj.state, set: (obj, value) => { obj.state = value; } }, metadata: _metadata }, _state_initializers, _state_extraInitializers);
            __esDecorate(null, null, _lga_decorators, { kind: "field", name: "lga", static: false, private: false, access: { has: obj => "lga" in obj, get: obj => obj.lga, set: (obj, value) => { obj.lga = value; } }, metadata: _metadata }, _lga_initializers, _lga_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.AgentPerformanceDto = AgentPerformanceDto;
//# sourceMappingURL=index.js.map