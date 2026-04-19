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
exports.FileUpload = exports.FileType = void 0;
const typeorm_1 = require("typeorm");
const supporter_entity_1 = require("./supporter.entity");
const user_entity_1 = require("./user.entity");
var FileType;
(function (FileType) {
    FileType["VOTER_CARD"] = "voter_card";
    FileType["IDENTITY_CARD"] = "identity_card";
    FileType["PASSPORT"] = "passport";
    FileType["DRIVER_LICENSE"] = "driver_license";
    FileType["UTILITY_BILL"] = "utility_bill";
    FileType["OTHER"] = "other";
})(FileType || (exports.FileType = FileType = {}));
let FileUpload = class FileUpload {
};
exports.FileUpload = FileUpload;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FileUpload.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], FileUpload.prototype, "supporterId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => supporter_entity_1.Supporter, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'supporterId' }),
    __metadata("design:type", supporter_entity_1.Supporter)
], FileUpload.prototype, "supporter", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], FileUpload.prototype, "uploadedByUserId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, {
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'uploadedByUserId' }),
    __metadata("design:type", user_entity_1.User)
], FileUpload.prototype, "uploadedByUser", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: FileType,
    }),
    __metadata("design:type", String)
], FileUpload.prototype, "fileType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], FileUpload.prototype, "fileName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], FileUpload.prototype, "filePath", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], FileUpload.prototype, "mimeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], FileUpload.prototype, "fileSize", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], FileUpload.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], FileUpload.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], FileUpload.prototype, "createdAt", void 0);
exports.FileUpload = FileUpload = __decorate([
    (0, typeorm_1.Entity)('file_uploads'),
    (0, typeorm_1.Index)(['supporterId']),
    (0, typeorm_1.Index)(['uploadedByUserId']),
    (0, typeorm_1.Index)(['createdAt'])
], FileUpload);
//# sourceMappingURL=file-upload.entity.js.map