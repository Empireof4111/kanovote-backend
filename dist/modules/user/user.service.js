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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../entities/user.entity");
let UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async create(createUserDto) {
        const user = this.userRepository.create(createUserDto);
        return this.userRepository.save(user);
    }
    async findById(id) {
        return this.userRepository.findOne({
            where: { id },
            relations: ['agents'],
        });
    }
    async findByEmail(email) {
        return this.userRepository.findOne({
            where: { email },
        });
    }
    async findByUsername(username) {
        return this.userRepository.findOne({
            where: { username },
        });
    }
    async findByResetToken(token) {
        return this.userRepository.findOne({
            where: { resetPasswordToken: token },
        });
    }
    async findAll(skip = 0, take = 10) {
        return this.userRepository.findAndCount({
            skip,
            take,
            order: { createdAt: 'DESC' },
        });
    }
    async updateLastLogin(userId) {
        await this.userRepository.update(userId, { lastLoginAt: new Date() });
    }
    async updateResetToken(userId, token, expiry) {
        await this.userRepository.update(userId, {
            resetPasswordToken: token,
            resetPasswordTokenExpiry: expiry,
        });
    }
    async updatePassword(userId, hashedPassword) {
        await this.userRepository.update(userId, {
            password: hashedPassword,
            resetPasswordToken: '',
            resetPasswordTokenExpiry: null,
        });
    }
    async updateProfile(userId, updateData) {
        await this.userRepository.update(userId, updateData);
        const user = await this.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async verifyEmail(userId) {
        await this.userRepository.update(userId, {
            isEmailVerified: true,
            emailVerificationToken: '',
            emailVerifiedAt: new Date(),
        });
    }
    async deactivateUser(userId) {
        await this.userRepository.update(userId, { isActive: false });
    }
    async activateUser(userId) {
        await this.userRepository.update(userId, { isActive: true });
    }
    async getUsersByRole(role, skip = 0, take = 10) {
        return this.userRepository.findAndCount({
            where: { role },
            skip,
            take,
            order: { createdAt: 'DESC' },
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map