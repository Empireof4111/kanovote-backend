"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("../../entities/user.entity");
const file_upload_entity_1 = require("../../entities/file-upload.entity");
let FileUploadController = (() => {
    let _classDecorators = [(0, common_1.Controller)('file-uploads'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _uploadFile_decorators;
    let _getFile_decorators;
    let _downloadFile_decorators;
    let _getFiles_decorators;
    let _deleteFile_decorators;
    var FileUploadController = _classThis = class {
        constructor(fileUploadService) {
            this.fileUploadService = (__runInitializers(this, _instanceExtraInitializers), fileUploadService);
        }
        async uploadFile(req, supporterId, file, { fileType }) {
            if (!file) {
                throw new common_1.BadRequestException('No file provided');
            }
            if (!Object.values(file_upload_entity_1.FileType).includes(fileType)) {
                throw new common_1.BadRequestException('Invalid file type');
            }
            return this.fileUploadService.uploadFile(file, supporterId, req.user.id, fileType);
        }
        async getFile(id) {
            return this.fileUploadService.findById(id);
        }
        async downloadFile(id, res) {
            const file = await this.fileUploadService.findById(id);
            const content = await this.fileUploadService.getFileContent(id);
            res.setHeader('Content-Type', file.mimeType);
            res.setHeader('Content-Disposition', `attachment; filename="${file.fileName}"`);
            res.send(content);
        }
        async getFiles(supporterId) {
            return this.fileUploadService.findBySupporterId(supporterId);
        }
        async deleteFile(id) {
            await this.fileUploadService.deleteFile(id);
        }
    };
    __setFunctionName(_classThis, "FileUploadController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _uploadFile_decorators = [(0, common_1.Post)(':supporterId'), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')), (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.FIELD_AGENT, user_entity_1.UserRole.SUPERVISOR), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED)];
        _getFile_decorators = [(0, common_1.Get)(':id'), (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.SUPERVISOR)];
        _downloadFile_decorators = [(0, common_1.Get)(':id/download'), (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.SUPERVISOR)];
        _getFiles_decorators = [(0, common_1.Get)('supporter/:supporterId'), (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.SUPERVISOR)];
        _deleteFile_decorators = [(0, common_1.Delete)(':id'), (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN), (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT)];
        __esDecorate(_classThis, null, _uploadFile_decorators, { kind: "method", name: "uploadFile", static: false, private: false, access: { has: obj => "uploadFile" in obj, get: obj => obj.uploadFile }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getFile_decorators, { kind: "method", name: "getFile", static: false, private: false, access: { has: obj => "getFile" in obj, get: obj => obj.getFile }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _downloadFile_decorators, { kind: "method", name: "downloadFile", static: false, private: false, access: { has: obj => "downloadFile" in obj, get: obj => obj.downloadFile }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getFiles_decorators, { kind: "method", name: "getFiles", static: false, private: false, access: { has: obj => "getFiles" in obj, get: obj => obj.getFiles }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteFile_decorators, { kind: "method", name: "deleteFile", static: false, private: false, access: { has: obj => "deleteFile" in obj, get: obj => obj.deleteFile }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FileUploadController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FileUploadController = _classThis;
})();
exports.FileUploadController = FileUploadController;
//# sourceMappingURL=file-upload.controller.js.map