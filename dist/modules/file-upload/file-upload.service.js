"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const file_upload_entity_1 = require("../../entities/file-upload.entity");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const uuid_1 = require("uuid");
let FileUploadService = class FileUploadService {
    constructor(fileUploadRepository) {
        this.fileUploadRepository = fileUploadRepository;
        this.uploadDir = process.env.FILE_UPLOAD_DIR || './uploads';
        // Create upload directory if it doesn't exist
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }
    async uploadFile(file, supporterId, uploadedByUserId, fileType) {
        // Validate file
        const maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '5242880') || 5242880; // 5MB default
        if (file.size > maxFileSize) {
            throw new common_1.BadRequestException(`File size exceeds maximum limit of ${maxFileSize / 1024 / 1024}MB`);
        }
        // Validate file type
        const allowedMimes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!allowedMimes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Invalid file type. Only JPEG, PNG, and PDF are allowed');
        }
        try {
            // Save file to disk
            const fileName = `${(0, uuid_1.v4)()}-${file.originalname}`;
            const filePath = path.join(this.uploadDir, fileName);
            fs.writeFileSync(filePath, file.buffer);
            // Create database record
            const fileUpload = this.fileUploadRepository.create({
                supporterId,
                uploadedByUserId,
                fileType,
                fileName: file.originalname,
                filePath,
                mimeType: file.mimetype,
                fileSize: file.size,
                url: `/uploads/${fileName}`,
            });
            return this.fileUploadRepository.save(fileUpload);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to upload file');
        }
    }
    async findById(id) {
        const file = await this.fileUploadRepository.findOne({ where: { id } });
        if (!file) {
            throw new common_1.NotFoundException('File not found');
        }
        return file;
    }
    async findBySupporterId(supporterId) {
        return this.fileUploadRepository.find({
            where: { supporterId, isActive: true },
            order: { createdAt: 'DESC' },
        });
    }
    async deleteFile(id) {
        const file = await this.findById(id);
        // Delete from disk
        if (fs.existsSync(file.filePath)) {
            fs.unlinkSync(file.filePath);
        }
        // Mark as inactive in database
        file.isActive = false;
        await this.fileUploadRepository.save(file);
    }
    async getFileContent(id) {
        const file = await this.findById(id);
        if (!file.isActive) {
            throw new common_1.BadRequestException('File is no longer available');
        }
        if (!fs.existsSync(file.filePath)) {
            throw new common_1.NotFoundException('File not found on disk');
        }
        return fs.readFileSync(file.filePath);
    }
};
exports.FileUploadService = FileUploadService;
exports.FileUploadService = FileUploadService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(file_upload_entity_1.FileUpload)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FileUploadService);
//# sourceMappingURL=file-upload.service.js.map