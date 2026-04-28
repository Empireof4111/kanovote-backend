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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcryptjs"));
const user_service_1 = require("../user/user.service");
const agent_entity_1 = require("../../entities/agent.entity");
const user_role_enum_1 = require("../../entities/user-role.enum");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    constructor(userService, jwtService, configService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async validateUser(email, password) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            return null;
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Your account has been deactivated. Please contact an administrator.');
        }
        if (!(await bcrypt.compare(password, user.password))) {
            return null;
        }
        if ((user.role === user_role_enum_1.UserRole.FIELD_AGENT || user.role === user_role_enum_1.UserRole.SUPERVISOR) &&
            user.agents?.some((agent) => agent.status !== agent_entity_1.AgentStatus.ACTIVE)) {
            throw new common_1.UnauthorizedException('Your agent account is inactive. Please contact an administrator.');
        }
        return user;
    }
    async login(user) {
        const payload = { sub: user.id, email: user.email };
        // Update last login
        await this.userService.updateLastLogin(user.id);
        return {
            access_token: this.jwtService.sign(payload, {
                expiresIn: 86400,
            }),
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username,
                role: user.role,
                phone: user.phone,
                isEmailVerified: user.isEmailVerified,
            },
        };
    }
    async register(registerDto) {
        // Check if user already exists
        const existingUser = await this.userService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new common_1.BadRequestException('Email already registered');
        }
        const existingUsername = await this.userService.findByUsername(registerDto.username);
        if (existingUsername) {
            throw new common_1.BadRequestException('Username already taken');
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const existingUsersCount = await this.userService.countAll();
        const role = existingUsersCount === 0 ? user_role_enum_1.UserRole.SUPER_ADMIN : user_role_enum_1.UserRole.FIELD_AGENT;
        // Create user
        const user = await this.userService.create({
            ...registerDto,
            password: hashedPassword,
            role,
        });
        return this.login(user);
    }
    async requestPasswordReset(resetPasswordDto) {
        const user = await this.userService.findByEmail(resetPasswordDto.email);
        if (!user) {
            throw new common_1.BadRequestException('User with this email does not exist');
        }
        // Generate reset token
        const resetToken = Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
        const resetTokenExpiry = new Date();
        resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // 1 hour expiry
        await this.userService.updateResetToken(user.id, resetToken, resetTokenExpiry);
        return {
            message: 'Password reset link sent to your email',
            resetToken, // In production, send via email
        };
    }
    async setNewPassword(setNewPasswordDto) {
        const user = await this.userService.findByResetToken(setNewPasswordDto.token);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid or expired reset token');
        }
        const hashedPassword = await bcrypt.hash(setNewPasswordDto.newPassword, 10);
        await this.userService.updatePassword(user.id, hashedPassword);
        return {
            message: 'Password reset successfully',
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map