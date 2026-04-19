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
exports.LocalGovernmentArea = void 0;
const typeorm_1 = require("typeorm");
const ward_entity_1 = require("./ward.entity");
let LocalGovernmentArea = class LocalGovernmentArea {
};
exports.LocalGovernmentArea = LocalGovernmentArea;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], LocalGovernmentArea.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], LocalGovernmentArea.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], LocalGovernmentArea.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], LocalGovernmentArea.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], LocalGovernmentArea.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], LocalGovernmentArea.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ward_entity_1.Ward, (ward) => ward.lga, {
        cascade: true,
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Array)
], LocalGovernmentArea.prototype, "wards", void 0);
exports.LocalGovernmentArea = LocalGovernmentArea = __decorate([
    (0, typeorm_1.Entity)('local_government_areas'),
    (0, typeorm_1.Index)(['code'], { unique: true })
], LocalGovernmentArea);
//# sourceMappingURL=lga.entity.js.map