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
var AdminBootstrapService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminBootstrapService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcryptjs"));
const user_role_enum_1 = require("../../entities/user-role.enum");
const user_service_1 = require("../user/user.service");
let AdminBootstrapService = AdminBootstrapService_1 = class AdminBootstrapService {
    constructor(configService, userService) {
        this.configService = configService;
        this.userService = userService;
        this.logger = new common_1.Logger(AdminBootstrapService_1.name);
    }
    async onApplicationBootstrap() {
        if (this.configService.get('BOOTSTRAP_ADMIN_ENABLED') !== 'true') {
            return;
        }
        const firstName = this.configService.get('BOOTSTRAP_ADMIN_FIRST_NAME');
        const lastName = this.configService.get('BOOTSTRAP_ADMIN_LAST_NAME');
        const email = this.configService.get('BOOTSTRAP_ADMIN_EMAIL')?.toLowerCase();
        const username = this.configService.get('BOOTSTRAP_ADMIN_USERNAME');
        const phone = this.configService.get('BOOTSTRAP_ADMIN_PHONE');
        const password = this.configService.get('BOOTSTRAP_ADMIN_PASSWORD');
        if (!firstName || !lastName || !email || !username || !phone || !password) {
            this.logger.error('Admin bootstrap is enabled but one or more BOOTSTRAP_ADMIN_* values are missing.');
            return;
        }
        const existingEmail = await this.userService.findByEmail(email);
        if (existingEmail) {
            this.logger.log(`Bootstrap admin ${email} already exists; no changes made.`);
            return;
        }
        const existingUsername = await this.userService.findByUsername(username);
        if (existingUsername) {
            this.logger.error(`Bootstrap admin username ${username} is already in use; no account was created.`);
            return;
        }
        await this.userService.create({
            firstName,
            lastName,
            email,
            username,
            phone,
            password: await bcrypt.hash(password, 10),
            role: user_role_enum_1.UserRole.SUPER_ADMIN,
        });
        this.logger.log(`Bootstrap super-admin ${email} created successfully.`);
    }
};
exports.AdminBootstrapService = AdminBootstrapService;
exports.AdminBootstrapService = AdminBootstrapService = AdminBootstrapService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        user_service_1.UserService])
], AdminBootstrapService);
//# sourceMappingURL=admin-bootstrap.service.js.map