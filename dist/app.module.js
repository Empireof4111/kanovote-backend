"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
const lga_entity_1 = require("./entities/lga.entity");
const ward_entity_1 = require("./entities/ward.entity");
const polling_unit_entity_1 = require("./entities/polling-unit.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
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
                    entities: [
                        user_entity_1.User,
                        agent_entity_1.Agent,
                        supporter_entity_1.Supporter,
                        registration_entity_1.Registration,
                        activity_log_entity_1.ActivityLog,
                        file_upload_entity_1.FileUpload,
                        lga_entity_1.LocalGovernmentArea,
                        ward_entity_1.Ward,
                        polling_unit_entity_1.PollingUnit,
                    ],
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
    })
], AppModule);
//# sourceMappingURL=app.module.js.map