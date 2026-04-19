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
exports.ExportService = void 0;
const common_1 = require("@nestjs/common");
const json2csv_1 = require("json2csv");
let ExportService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ExportService = _classThis = class {
        constructor(supporterRepository, agentRepository, registrationRepository) {
            this.supporterRepository = supporterRepository;
            this.agentRepository = agentRepository;
            this.registrationRepository = registrationRepository;
        }
        async exportSupportersCSV(filters) {
            let query = this.supporterRepository.createQueryBuilder('supporter');
            if (filters?.state) {
                query = query.where('supporter.state = :state', { state: filters.state });
            }
            if (filters?.lga) {
                query = query.andWhere('supporter.lga = :lga', { lga: filters.lga });
            }
            if (filters?.status) {
                query = query.andWhere('supporter.status = :status', { status: filters.status });
            }
            const supporters = await query.getMany();
            const fields = [
                'id',
                'firstName',
                'lastName',
                'email',
                'phone',
                'gender',
                'occupation',
                'state',
                'lga',
                'ward',
                'pollingUnit',
                'voterCardNumber',
                'status',
                'registeredAt',
            ];
            const parser = new json2csv_1.Parser({ fields });
            return parser.parse(supporters);
        }
        async exportAgentsCSV(filters) {
            let query = this.agentRepository.createQueryBuilder('agent');
            if (filters?.state) {
                query = query.where('agent.state = :state', { state: filters.state });
            }
            if (filters?.lga) {
                query = query.andWhere('agent.lga = :lga', { lga: filters.lga });
            }
            const agents = await query.leftJoinAndSelect('agent.user', 'user').getMany();
            const data = agents.map((agent) => ({
                id: agent.id,
                name: `${agent.user.firstName} ${agent.user.lastName}`,
                email: agent.user.email,
                phone: agent.user.phone,
                role: agent.role,
                state: agent.state,
                lga: agent.lga,
                ward: agent.ward,
                totalRegistrations: agent.totalRegistrations,
                verifiedRegistrations: agent.verifiedRegistrations,
                status: agent.status,
                joinedAt: agent.joinedAt,
            }));
            const fields = [
                'id',
                'name',
                'email',
                'phone',
                'role',
                'state',
                'lga',
                'ward',
                'totalRegistrations',
                'verifiedRegistrations',
                'status',
                'joinedAt',
            ];
            const parser = new json2csv_1.Parser({ fields });
            return parser.parse(data);
        }
        async exportRegistrationsCSV(filters) {
            let query = this.registrationRepository.createQueryBuilder('registration');
            if (filters?.agentId) {
                query = query.where('registration.agentId = :agentId', { agentId: filters.agentId });
            }
            if (filters?.status) {
                query = query.andWhere('registration.status = :status', { status: filters.status });
            }
            const registrations = await query
                .leftJoinAndSelect('registration.supporter', 'supporter')
                .leftJoinAndSelect('registration.agent', 'agent')
                .getMany();
            const data = registrations.map((reg) => ({
                id: reg.id,
                supporterName: `${reg.supporter.firstName} ${reg.supporter.lastName}`,
                supporterEmail: reg.supporter.email,
                state: reg.supporter.state,
                lga: reg.supporter.lga,
                status: reg.status,
                completionPercentage: reg.completionPercentage,
                createdAt: reg.createdAt,
                completedAt: reg.completedAt,
            }));
            const fields = [
                'id',
                'supporterName',
                'supporterEmail',
                'state',
                'lga',
                'status',
                'completionPercentage',
                'createdAt',
                'completedAt',
            ];
            const parser = new json2csv_1.Parser({ fields });
            return parser.parse(data);
        }
    };
    __setFunctionName(_classThis, "ExportService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ExportService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ExportService = _classThis;
})();
exports.ExportService = ExportService;
//# sourceMappingURL=export.service.js.map