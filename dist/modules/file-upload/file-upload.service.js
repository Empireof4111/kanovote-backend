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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const file_upload_entity_1 = require("../../entities/file-upload.entity");
const supporter_entity_1 = require("../../entities/supporter.entity");
const uuid_1 = require("uuid");
const cloudinary_1 = require("cloudinary");
let FileUploadService = class FileUploadService {
    constructor(fileUploadRepository, supporterRepository) {
        this.fileUploadRepository = fileUploadRepository;
        this.supporterRepository = supporterRepository;
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }
    async uploadFile(file, supporterId, uploadedByUserId, fileType) {
        // Validate file
        const maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '5242880') || 5242880; // 5MB default
        if (file.size > maxFileSize) {
            throw new common_1.BadRequestException(`File size exceeds maximum limit of ${maxFileSize / 1024 / 1024}MB`);
        }
        // Validate file type
        const allowedMimes = ['image/jpeg', 'image/png'];
        if (!allowedMimes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Invalid file type. Only JPEG and PNG images are allowed');
        }
        try {
            if (!process.env.CLOUDINARY_CLOUD_NAME ||
                !process.env.CLOUDINARY_API_KEY ||
                !process.env.CLOUDINARY_API_SECRET) {
                throw new common_1.BadRequestException('Cloudinary is not configured');
            }
            const publicId = `${process.env.CLOUDINARY_FOLDER || 'kanovote'}/${supporterId}/${(0, uuid_1.v4)()}-${file.originalname}`;
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                    public_id: publicId,
                    resource_type: 'image',
                    overwrite: false,
                }, (error, result) => {
                    if (error || !result) {
                        reject(error || new Error('Upload failed'));
                        return;
                    }
                    resolve(result);
                });
                uploadStream.end(file.buffer);
            });
            // Create database record
            const fileUpload = this.fileUploadRepository.create({
                supporterId,
                uploadedByUserId,
                fileType,
                fileName: file.originalname,
                filePath: uploadResult.public_id,
                mimeType: file.mimetype,
                fileSize: file.size,
                url: uploadResult.secure_url,
            });
            const savedFile = await this.fileUploadRepository.save(fileUpload);
            await this.supporterRepository.update(supporterId, {
                documentUploaded: true,
                documentUrl: savedFile.url,
            });
            return savedFile;
        }
        catch (error) {
            throw new common_1.BadRequestException(error instanceof Error ? error.message : 'Failed to upload file');
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
        if (file.filePath) {
            await cloudinary_1.v2.uploader.destroy(file.filePath, {
                resource_type: 'image',
            });
        }
        // Mark as inactive in database
        file.isActive = false;
        await this.fileUploadRepository.save(file);
        const activeFiles = await this.fileUploadRepository.count({
            where: { supporterId: file.supporterId, isActive: true },
        });
        if (activeFiles === 0) {
            await this.supporterRepository.update(file.supporterId, {
                documentUploaded: false,
                documentUrl: null,
            });
        }
    }
    async getFileContent(id) {
        const file = await this.findById(id);
        if (!file.isActive) {
            throw new common_1.BadRequestException('File is no longer available');
        }
        if (!file.url) {
            throw new common_1.NotFoundException('File URL not found');
        }
        return file.url;
    }
};
exports.FileUploadService = FileUploadService;
exports.FileUploadService = FileUploadService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(file_upload_entity_1.FileUpload)),
    __param(1, (0, typeorm_1.InjectRepository)(supporter_entity_1.Supporter)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], FileUploadService);
//# sourceMappingURL=file-upload.service.js.map