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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadService = void 0;
const common_1 = require("@nestjs/common");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const uuid_1 = require("uuid");
let FileUploadService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var FileUploadService = _classThis = class {
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
            const maxFileSize = parseInt(process.env.MAX_FILE_SIZE) || 5242880; // 5MB default
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
    __setFunctionName(_classThis, "FileUploadService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FileUploadService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FileUploadService = _classThis;
})();
exports.FileUploadService = FileUploadService;
//# sourceMappingURL=file-upload.service.js.map