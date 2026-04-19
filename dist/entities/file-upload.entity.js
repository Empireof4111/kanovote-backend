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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
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
let FileUpload = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)('file_uploads'), (0, typeorm_1.Index)(['supporterId']), (0, typeorm_1.Index)(['uploadedByUserId']), (0, typeorm_1.Index)(['createdAt'])];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _supporterId_decorators;
    let _supporterId_initializers = [];
    let _supporterId_extraInitializers = [];
    let _supporter_decorators;
    let _supporter_initializers = [];
    let _supporter_extraInitializers = [];
    let _uploadedByUserId_decorators;
    let _uploadedByUserId_initializers = [];
    let _uploadedByUserId_extraInitializers = [];
    let _uploadedByUser_decorators;
    let _uploadedByUser_initializers = [];
    let _uploadedByUser_extraInitializers = [];
    let _fileType_decorators;
    let _fileType_initializers = [];
    let _fileType_extraInitializers = [];
    let _fileName_decorators;
    let _fileName_initializers = [];
    let _fileName_extraInitializers = [];
    let _filePath_decorators;
    let _filePath_initializers = [];
    let _filePath_extraInitializers = [];
    let _mimeType_decorators;
    let _mimeType_initializers = [];
    let _mimeType_extraInitializers = [];
    let _fileSize_decorators;
    let _fileSize_initializers = [];
    let _fileSize_extraInitializers = [];
    let _url_decorators;
    let _url_initializers = [];
    let _url_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    var FileUpload = _classThis = class {
        constructor() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.supporterId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _supporterId_initializers, void 0));
            this.supporter = (__runInitializers(this, _supporterId_extraInitializers), __runInitializers(this, _supporter_initializers, void 0));
            this.uploadedByUserId = (__runInitializers(this, _supporter_extraInitializers), __runInitializers(this, _uploadedByUserId_initializers, void 0));
            this.uploadedByUser = (__runInitializers(this, _uploadedByUserId_extraInitializers), __runInitializers(this, _uploadedByUser_initializers, void 0));
            this.fileType = (__runInitializers(this, _uploadedByUser_extraInitializers), __runInitializers(this, _fileType_initializers, void 0));
            this.fileName = (__runInitializers(this, _fileType_extraInitializers), __runInitializers(this, _fileName_initializers, void 0));
            this.filePath = (__runInitializers(this, _fileName_extraInitializers), __runInitializers(this, _filePath_initializers, void 0));
            this.mimeType = (__runInitializers(this, _filePath_extraInitializers), __runInitializers(this, _mimeType_initializers, void 0));
            this.fileSize = (__runInitializers(this, _mimeType_extraInitializers), __runInitializers(this, _fileSize_initializers, void 0));
            this.url = (__runInitializers(this, _fileSize_extraInitializers), __runInitializers(this, _url_initializers, void 0));
            this.isActive = (__runInitializers(this, _url_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.createdAt = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            __runInitializers(this, _createdAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "FileUpload");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _supporterId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
        _supporter_decorators = [(0, typeorm_1.ManyToOne)(() => supporter_entity_1.Supporter, {
                onDelete: 'CASCADE',
            }), (0, typeorm_1.JoinColumn)({ name: 'supporterId' })];
        _uploadedByUserId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
        _uploadedByUser_decorators = [(0, typeorm_1.ManyToOne)(() => user_entity_1.User, {
                onDelete: 'SET NULL',
            }), (0, typeorm_1.JoinColumn)({ name: 'uploadedByUserId' })];
        _fileType_decorators = [(0, typeorm_1.Column)({
                type: 'enum',
                enum: FileType,
            })];
        _fileName_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 500 })];
        _filePath_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 500 })];
        _mimeType_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 100 })];
        _fileSize_decorators = [(0, typeorm_1.Column)({ type: 'bigint' })];
        _url_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true })];
        _isActive_decorators = [(0, typeorm_1.Column)({ type: 'boolean', default: true })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _supporterId_decorators, { kind: "field", name: "supporterId", static: false, private: false, access: { has: obj => "supporterId" in obj, get: obj => obj.supporterId, set: (obj, value) => { obj.supporterId = value; } }, metadata: _metadata }, _supporterId_initializers, _supporterId_extraInitializers);
        __esDecorate(null, null, _supporter_decorators, { kind: "field", name: "supporter", static: false, private: false, access: { has: obj => "supporter" in obj, get: obj => obj.supporter, set: (obj, value) => { obj.supporter = value; } }, metadata: _metadata }, _supporter_initializers, _supporter_extraInitializers);
        __esDecorate(null, null, _uploadedByUserId_decorators, { kind: "field", name: "uploadedByUserId", static: false, private: false, access: { has: obj => "uploadedByUserId" in obj, get: obj => obj.uploadedByUserId, set: (obj, value) => { obj.uploadedByUserId = value; } }, metadata: _metadata }, _uploadedByUserId_initializers, _uploadedByUserId_extraInitializers);
        __esDecorate(null, null, _uploadedByUser_decorators, { kind: "field", name: "uploadedByUser", static: false, private: false, access: { has: obj => "uploadedByUser" in obj, get: obj => obj.uploadedByUser, set: (obj, value) => { obj.uploadedByUser = value; } }, metadata: _metadata }, _uploadedByUser_initializers, _uploadedByUser_extraInitializers);
        __esDecorate(null, null, _fileType_decorators, { kind: "field", name: "fileType", static: false, private: false, access: { has: obj => "fileType" in obj, get: obj => obj.fileType, set: (obj, value) => { obj.fileType = value; } }, metadata: _metadata }, _fileType_initializers, _fileType_extraInitializers);
        __esDecorate(null, null, _fileName_decorators, { kind: "field", name: "fileName", static: false, private: false, access: { has: obj => "fileName" in obj, get: obj => obj.fileName, set: (obj, value) => { obj.fileName = value; } }, metadata: _metadata }, _fileName_initializers, _fileName_extraInitializers);
        __esDecorate(null, null, _filePath_decorators, { kind: "field", name: "filePath", static: false, private: false, access: { has: obj => "filePath" in obj, get: obj => obj.filePath, set: (obj, value) => { obj.filePath = value; } }, metadata: _metadata }, _filePath_initializers, _filePath_extraInitializers);
        __esDecorate(null, null, _mimeType_decorators, { kind: "field", name: "mimeType", static: false, private: false, access: { has: obj => "mimeType" in obj, get: obj => obj.mimeType, set: (obj, value) => { obj.mimeType = value; } }, metadata: _metadata }, _mimeType_initializers, _mimeType_extraInitializers);
        __esDecorate(null, null, _fileSize_decorators, { kind: "field", name: "fileSize", static: false, private: false, access: { has: obj => "fileSize" in obj, get: obj => obj.fileSize, set: (obj, value) => { obj.fileSize = value; } }, metadata: _metadata }, _fileSize_initializers, _fileSize_extraInitializers);
        __esDecorate(null, null, _url_decorators, { kind: "field", name: "url", static: false, private: false, access: { has: obj => "url" in obj, get: obj => obj.url, set: (obj, value) => { obj.url = value; } }, metadata: _metadata }, _url_initializers, _url_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FileUpload = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FileUpload = _classThis;
})();
exports.FileUpload = FileUpload;
//# sourceMappingURL=file-upload.entity.js.map