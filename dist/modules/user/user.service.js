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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
let UserService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var UserService = _classThis = class {
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
                resetPasswordToken: null,
                resetPasswordTokenExpiry: null,
            });
        }
        async updateProfile(userId, updateData) {
            await this.userRepository.update(userId, updateData);
            return this.findById(userId);
        }
        async verifyEmail(userId) {
            await this.userRepository.update(userId, {
                isEmailVerified: true,
                emailVerificationToken: null,
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
    __setFunctionName(_classThis, "UserService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UserService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UserService = _classThis;
})();
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map