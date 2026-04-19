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
exports.PollingUnit = void 0;
const typeorm_1 = require("typeorm");
const ward_entity_1 = require("./ward.entity");
const lga_entity_1 = require("./lga.entity");
let PollingUnit = class PollingUnit {
};
exports.PollingUnit = PollingUnit;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PollingUnit.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], PollingUnit.prototype, "wardId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], PollingUnit.prototype, "lgaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ward_entity_1.Ward, (ward) => ward.pollingUnits, {
        onDelete: 'CASCADE',
        eager: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'wardId' }),
    __metadata("design:type", ward_entity_1.Ward)
], PollingUnit.prototype, "ward", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => lga_entity_1.LocalGovernmentArea, {
        onDelete: 'CASCADE',
        eager: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'lgaId' }),
    __metadata("design:type", lga_entity_1.LocalGovernmentArea)
], PollingUnit.prototype, "lga", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], PollingUnit.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], PollingUnit.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], PollingUnit.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], PollingUnit.prototype, "registeredVoters", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PollingUnit.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], PollingUnit.prototype, "updatedAt", void 0);
exports.PollingUnit = PollingUnit = __decorate([
    (0, typeorm_1.Entity)('polling_units'),
    (0, typeorm_1.Index)(['code'], { unique: true })
], PollingUnit);
//# sourceMappingURL=polling-unit.entity.js.map