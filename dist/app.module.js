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
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./modules/auth/auth.module");
const agents_module_1 = require("./modules/agents/agents.module");
const supporters_module_1 = require("./modules/supporters/supporters.module");
const registrations_module_1 = require("./modules/registrations/registrations.module");
const file_upload_module_1 = require("./modules/file-upload/file-upload.module");
const activity_module_1 = require("./modules/activity/activity.module");
const export_module_1 = require("./modules/export/export.module");
const admin_module_1 = require("./modules/admin/admin.module");
const user_entity_1 = require("./entities/user.entity");
const agent_entity_1 = require("./entities/agent.entity");
const supporter_entity_1 = require("./entities/supporter.entity");
const registration_entity_1 = require("./entities/registration.entity");
const activity_log_entity_1 = require("./entities/activity-log.entity");
const file_upload_entity_1 = require("./entities/file-upload.entity");
let AppModule = (() => {
    let _classDecorators = [(0, common_1.Module)({
            imports: [
                config_1.ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: '.env',
                }),
                typeorm_1.TypeOrmModule.forRootAsync({
                    imports: [config_1.ConfigModule],
                    inject: [config_1.ConfigService],
                    useFactory: (configService) => ({
                        type: 'postgres',
                        host: configService.get('DATABASE_HOST', 'localhost'),
                        port: configService.get('DATABASE_PORT', 5432),
                        username: configService.get('DATABASE_USER', 'postgres'),
                        password: configService.get('DATABASE_PASSWORD', 'postgres'),
                        database: configService.get('DATABASE_NAME', 'kano_registration_db'),
                        entities: [user_entity_1.User, agent_entity_1.Agent, supporter_entity_1.Supporter, registration_entity_1.Registration, activity_log_entity_1.ActivityLog, file_upload_entity_1.FileUpload],
                        synchronize: configService.get('NODE_ENV') === 'development',
                        logging: configService.get('NODE_ENV') === 'development',
                        dropSchema: false,
                    }),
                }),
                auth_module_1.AuthModule,
                agents_module_1.AgentModule,
                supporters_module_1.SupporterModule,
                registrations_module_1.RegistrationModule,
                file_upload_module_1.FileUploadModule,
                activity_module_1.ActivityModule,
                export_module_1.ExportModule,
                admin_module_1.AdminModule,
            ],
            controllers: [],
            providers: [],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AppModule = _classThis = class {
    };
    __setFunctionName(_classThis, "AppModule");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AppModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppModule = _classThis;
})();
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map