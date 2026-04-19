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
exports.SupporterService = void 0;
const common_1 = require("@nestjs/common");
const supporter_entity_1 = require("../../entities/supporter.entity");
let SupporterService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var SupporterService = _classThis = class {
        constructor(supporterRepository) {
            this.supporterRepository = supporterRepository;
        }
        async create(createSupporterDto, registeredByUserId) {
            // Check if supporter with same email or voter card already exists
            const existingSupporter = await this.supporterRepository.findOne({
                where: [
                    { email: createSupporterDto.email },
                    { voterCardNumber: createSupporterDto.voterCardNumber },
                ],
            });
            if (existingSupporter) {
                throw new common_1.BadRequestException('Supporter with this email or voter card number already exists');
            }
            const supporter = this.supporterRepository.create({
                ...createSupporterDto,
                registeredByUserId,
            });
            return this.supporterRepository.save(supporter);
        }
        async findById(id) {
            const supporter = await this.supporterRepository.findOne({
                where: { id },
                relations: ['registeredByUser'],
            });
            if (!supporter) {
                throw new common_1.NotFoundException('Supporter not found');
            }
            return supporter;
        }
        async findAll(skip = 0, take = 10, filters) {
            const query = this.supporterRepository.createQueryBuilder('supporter');
            if (filters?.state) {
                query.andWhere('supporter.state = :state', { state: filters.state });
            }
            if (filters?.lga) {
                query.andWhere('supporter.lga = :lga', { lga: filters.lga });
            }
            if (filters?.status) {
                query.andWhere('supporter.status = :status', { status: filters.status });
            }
            if (filters?.search) {
                query.andWhere('(supporter.firstName ILIKE :search OR supporter.lastName ILIKE :search OR supporter.email ILIKE :search)', { search: `%${filters.search}%` });
            }
            return query
                .leftJoinAndSelect('supporter.registeredByUser', 'user')
                .skip(skip)
                .take(take)
                .orderBy('supporter.registeredAt', 'DESC')
                .getManyAndCount();
        }
        async update(id, updateSupporterDto) {
            const supporter = await this.findById(id);
            Object.assign(supporter, updateSupporterDto);
            return this.supporterRepository.save(supporter);
        }
        async verify(id, verifySupporterDto, verifiedByUserId) {
            const supporter = await this.findById(id);
            supporter.status = verifySupporterDto.status;
            supporter.verificationNotes = verifySupporterDto.notes;
            supporter.verifiedByUserId = verifiedByUserId;
            supporter.verifiedAt = new Date();
            return this.supporterRepository.save(supporter);
        }
        async getStatistics() {
            const [total, verified, pending, rejected] = await Promise.all([
                this.supporterRepository.count(),
                this.supporterRepository.count({ where: { status: supporter_entity_1.VerificationStatus.VERIFIED } }),
                this.supporterRepository.count({ where: { status: supporter_entity_1.VerificationStatus.PENDING } }),
                this.supporterRepository.count({ where: { status: supporter_entity_1.VerificationStatus.REJECTED } }),
            ]);
            return {
                total,
                verified,
                pending,
                rejected,
                verificationRate: total > 0 ? ((verified / total) * 100).toFixed(2) : 0,
            };
        }
        async getStatisticsByLocation(state, lga) {
            let query = this.supporterRepository.createQueryBuilder('supporter')
                .where('supporter.state = :state', { state });
            if (lga) {
                query = query.andWhere('supporter.lga = :lga', { lga });
            }
            const [total, verified, pending] = await Promise.all([
                query.clone().getCount(),
                query.clone().andWhere('supporter.status = :verified', { verified: supporter_entity_1.VerificationStatus.VERIFIED }).getCount(),
                query.clone().andWhere('supporter.status = :pending', { pending: supporter_entity_1.VerificationStatus.PENDING }).getCount(),
            ]);
            return {
                state,
                lga: lga || null,
                total,
                verified,
                pending,
                verificationRate: total > 0 ? ((verified / total) * 100).toFixed(2) : 0,
            };
        }
        async delete(id) {
            const supporter = await this.findById(id);
            await this.supporterRepository.remove(supporter);
        }
    };
    __setFunctionName(_classThis, "SupporterService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SupporterService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SupporterService = _classThis;
})();
exports.SupporterService = SupporterService;
//# sourceMappingURL=supporters.service.js.map