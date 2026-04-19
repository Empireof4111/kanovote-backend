"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
let Registration = class Registration {
};
exports.Registration = Registration;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Registration.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Registration.prototype, "agentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => agent_entity_1.Agent, (agent) => agent.registrations, {
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'agentId' }),
    __metadata("design:type", agent_entity_1.Agent)
], Registration.prototype, "agent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Registration.prototype, "supporterId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => supporter_entity_1.Supporter, (supporter) => supporter.registrations, {
        onDelete: 'CASCADE',
        eager: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'supporterId' }),
    __metadata("design:type", supporter_entity_1.Supporter)
], Registration.prototype, "supporter", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RegistrationStatus,
        default: RegistrationStatus.INITIATED,
    }),
    __metadata("design:type", String)
], Registration.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Registration.prototype, "completionPercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Registration.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Registration.prototype, "verifiedByUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Registration.prototype, "verifiedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Registration.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Registration.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Registration.prototype, "updatedAt", void 0);
exports.Registration = Registration = __decorate([
    (0, typeorm_1.Entity)('registrations'),
    (0, typeorm_1.Index)(['agentId']),
    (0, typeorm_1.Index)(['supporterId']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['createdAt'])
], Registration);
//# sourceMappingURL=registration.entity.js.map