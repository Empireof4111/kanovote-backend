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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv = __importStar(require("dotenv"));
const user_entity_1 = require("./entities/user.entity");
const agent_entity_1 = require("./entities/agent.entity");
const supporter_entity_1 = require("./entities/supporter.entity");
const registration_entity_1 = require("./entities/registration.entity");
const activity_log_entity_1 = require("./entities/activity-log.entity");
const file_upload_entity_1 = require("./entities/file-upload.entity");
const lga_entity_1 = require("./entities/lga.entity");
const ward_entity_1 = require("./entities/ward.entity");
const polling_unit_entity_1 = require("./entities/polling-unit.entity");
dotenv.config();
const isEnabled = (value) => ['true', '1', 'yes', 'on'].includes((value ?? '').toLowerCase());
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432') || 5432,
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'kano_registration_db',
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
    migrations: ['src/migrations/*.ts'],
    subscribers: ['src/subscribers/*.ts'],
    synchronize: isEnabled(process.env.DATABASE_SYNCHRONIZE),
    logging: isEnabled(process.env.DATABASE_LOGGING),
    dropSchema: false,
});
//# sourceMappingURL=database.js.map