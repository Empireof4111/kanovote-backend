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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../entities/user.entity");
const user_role_enum_1 = require("../../entities/user-role.enum");
const agent_entity_1 = require("../../entities/agent.entity");
const lga_entity_1 = require("../../entities/lga.entity");
const ward_entity_1 = require("../../entities/ward.entity");
const polling_unit_entity_1 = require("../../entities/polling-unit.entity");
const supporter_entity_1 = require("../../entities/supporter.entity");
const registration_entity_1 = require("../../entities/registration.entity");
let AdminService = class AdminService {
    constructor(userRepository, agentRepository, lgaRepository, wardRepository, pollingUnitRepository, supporterRepository, registrationRepository) {
        this.userRepository = userRepository;
        this.agentRepository = agentRepository;
        this.lgaRepository = lgaRepository;
        this.wardRepository = wardRepository;
        this.pollingUnitRepository = pollingUnitRepository;
        this.supporterRepository = supporterRepository;
        this.registrationRepository = registrationRepository;
    }
    // USER MANAGEMENT
    async getAllUsers(skip = 0, take = 10, role) {
        let query = this.userRepository.createQueryBuilder('user');
        if (role) {
            query = query.where('user.role = :role', { role });
        }
        return query
            .skip(skip)
            .take(take)
            .orderBy('user.createdAt', 'DESC')
            .getManyAndCount();
    }
    async getUserStats() {
        const [total, superAdmins, supervisors, fieldAgents] = await Promise.all([
            this.userRepository.count(),
            this.userRepository.count({ where: { role: user_role_enum_1.UserRole.SUPER_ADMIN } }),
            this.userRepository.count({ where: { role: user_role_enum_1.UserRole.SUPERVISOR } }),
            this.userRepository.count({ where: { role: user_role_enum_1.UserRole.FIELD_AGENT } }),
        ]);
        return {
            total,
            superAdmins,
            supervisors,
            fieldAgents,
        };
    }
    async updateUserRole(userId, updateUserRoleDto) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        user.role = updateUserRoleDto.role;
        return this.userRepository.save(user);
    }
    async blockUser(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        user.isActive = false;
        return this.userRepository.save(user);
    }
    async unblockUser(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        user.isActive = true;
        return this.userRepository.save(user);
    }
    // AGENT STATS
    async getAgentStats() {
        const [total, active, inactive, suspended] = await Promise.all([
            this.agentRepository.count(),
            this.agentRepository.count({ where: { status: agent_entity_1.AgentStatus.ACTIVE } }),
            this.agentRepository.count({ where: { status: agent_entity_1.AgentStatus.INACTIVE } }),
            this.agentRepository.count({ where: { status: agent_entity_1.AgentStatus.SUSPENDED } }),
        ]);
        return {
            total,
            active,
            inactive,
            suspended,
        };
    }
    // LOCAL GOVERNMENT AREA (LGA) MANAGEMENT
    async createLga(createLgaDto) {
        // Check if LGA with this code already exists
        const existingLga = await this.lgaRepository.findOne({
            where: { code: createLgaDto.code },
        });
        if (existingLga) {
            throw new common_1.ConflictException('LGA with this code already exists');
        }
        const lga = this.lgaRepository.create(createLgaDto);
        return this.lgaRepository.save(lga);
    }
    async getAllLgas(skip = 0, take = 100) {
        return this.lgaRepository.findAndCount({
            skip,
            take,
            relations: ['wards'],
            order: { name: 'ASC' },
        });
    }
    async getLgaById(id) {
        const lga = await this.lgaRepository.findOne({
            where: { id },
            relations: ['wards'],
        });
        if (!lga) {
            throw new common_1.NotFoundException('LGA not found');
        }
        return lga;
    }
    async updateLga(id, updateLgaDto) {
        const lga = await this.getLgaById(id);
        // Check if new code conflicts with existing LGA
        if (updateLgaDto.code && updateLgaDto.code !== lga.code) {
            const existingLga = await this.lgaRepository.findOne({
                where: { code: updateLgaDto.code },
            });
            if (existingLga) {
                throw new common_1.ConflictException('LGA with this code already exists');
            }
        }
        Object.assign(lga, updateLgaDto);
        return this.lgaRepository.save(lga);
    }
    async deleteLga(id) {
        const lga = await this.getLgaById(id);
        await this.lgaRepository.remove(lga);
    }
    // WARD MANAGEMENT
    async createWard(createWardDto) {
        // Verify LGA exists
        const lga = await this.getLgaById(createWardDto.lgaId);
        // Check if Ward with this code already exists in this LGA
        const existingWard = await this.wardRepository.findOne({
            where: {
                lgaId: createWardDto.lgaId,
                code: createWardDto.code,
            },
        });
        if (existingWard) {
            throw new common_1.ConflictException('Ward with this code already exists in this LGA');
        }
        const ward = this.wardRepository.create({
            ...createWardDto,
            lga,
        });
        return this.wardRepository.save(ward);
    }
    async getAllWards(lgaId, skip = 0, take = 100) {
        let query = this.wardRepository.createQueryBuilder('ward');
        if (lgaId) {
            query = query.where('ward.lgaId = :lgaId', { lgaId });
        }
        return query
            .leftJoinAndSelect('ward.lga', 'lga')
            .skip(skip)
            .take(take)
            .orderBy('ward.name', 'ASC')
            .getManyAndCount();
    }
    async getWardById(id) {
        const ward = await this.wardRepository.findOne({
            where: { id },
            relations: ['lga', 'pollingUnits'],
        });
        if (!ward) {
            throw new common_1.NotFoundException('Ward not found');
        }
        return ward;
    }
    async updateWard(id, updateWardDto) {
        const ward = await this.getWardById(id);
        // Check if new code conflicts with existing Ward in same LGA
        if (updateWardDto.code && updateWardDto.code !== ward.code) {
            const existingWard = await this.wardRepository.findOne({
                where: {
                    lgaId: ward.lgaId,
                    code: updateWardDto.code,
                },
            });
            if (existingWard) {
                throw new common_1.ConflictException('Ward with this code already exists in this LGA');
            }
        }
        Object.assign(ward, updateWardDto);
        return this.wardRepository.save(ward);
    }
    async deleteWard(id) {
        const ward = await this.getWardById(id);
        await this.wardRepository.remove(ward);
    }
    // POLLING UNIT MANAGEMENT
    async createPollingUnit(createPollingUnitDto) {
        // Verify Ward and LGA exist
        const ward = await this.getWardById(createPollingUnitDto.wardId);
        const lga = await this.getLgaById(createPollingUnitDto.lgaId);
        // Check if code already exists
        const existingPu = await this.pollingUnitRepository.findOne({
            where: { code: createPollingUnitDto.code },
        });
        if (existingPu) {
            throw new common_1.ConflictException('Polling Unit with this code already exists');
        }
        const pollingUnit = this.pollingUnitRepository.create({
            ...createPollingUnitDto,
            ward,
            lga,
        });
        return this.pollingUnitRepository.save(pollingUnit);
    }
    async getAllPollingUnits(wardId, lgaId, skip = 0, take = 100) {
        let query = this.pollingUnitRepository.createQueryBuilder('pu');
        if (wardId) {
            query = query.where('pu.wardId = :wardId', { wardId });
        }
        if (lgaId) {
            query = query.andWhere('pu.lgaId = :lgaId', { lgaId });
        }
        return query
            .leftJoinAndSelect('pu.ward', 'ward')
            .leftJoinAndSelect('pu.lga', 'lga')
            .skip(skip)
            .take(take)
            .orderBy('pu.name', 'ASC')
            .getManyAndCount();
    }
    async getPollingUnitById(id) {
        const pu = await this.pollingUnitRepository.findOne({
            where: { id },
            relations: ['ward', 'lga'],
        });
        if (!pu) {
            throw new common_1.NotFoundException('Polling Unit not found');
        }
        return pu;
    }
    async updatePollingUnit(id, updatePollingUnitDto) {
        const pu = await this.getPollingUnitById(id);
        // Check if new code conflicts
        if (updatePollingUnitDto.code && updatePollingUnitDto.code !== pu.code) {
            const existingPu = await this.pollingUnitRepository.findOne({
                where: { code: updatePollingUnitDto.code },
            });
            if (existingPu) {
                throw new common_1.ConflictException('Polling Unit with this code already exists');
            }
        }
        Object.assign(pu, updatePollingUnitDto);
        return this.pollingUnitRepository.save(pu);
    }
    async deletePollingUnit(id) {
        const pu = await this.getPollingUnitById(id);
        await this.pollingUnitRepository.remove(pu);
    }
    async importLocations(file, replace = false) {
        if (!file || !file.buffer) {
            throw new common_1.BadRequestException('CSV file is required');
        }
        const csvContent = file.buffer.toString('utf8');
        // Inline lightweight CSV parser and normalization (matching existing script)
        const parseCsv = (content) => {
            const rows = [];
            let currentRow = [];
            let currentValue = '';
            let inQuotes = false;
            for (let i = 0; i < content.length; i += 1) {
                const char = content[i];
                const nextChar = content[i + 1];
                if (char === '"') {
                    if (inQuotes && nextChar === '"') {
                        currentValue += '"';
                        i += 1;
                    }
                    else {
                        inQuotes = !inQuotes;
                    }
                    continue;
                }
                if (char === ',' && !inQuotes) {
                    currentRow.push(currentValue);
                    currentValue = '';
                    continue;
                }
                if ((char === '\n' || char === '\r') && !inQuotes) {
                    if (char === '\r' && nextChar === '\n') {
                        i += 1;
                    }
                    currentRow.push(currentValue);
                    if (currentRow.some((cell) => cell.trim() !== '')) {
                        rows.push(currentRow);
                    }
                    currentRow = [];
                    currentValue = '';
                    continue;
                }
                currentValue += char;
            }
            if (currentValue.length > 0 || currentRow.length > 0) {
                currentRow.push(currentValue);
                if (currentRow.some((cell) => cell.trim() !== '')) {
                    rows.push(currentRow);
                }
            }
            return rows;
        };
        const normalizeHeader = (value) => value.trim().toLowerCase().replace(/[\s-]+/g, '_');
        const normalizeValue = (v) => (v || '').trim();
        const parsedRows = parseCsv(csvContent);
        if (parsedRows.length < 2) {
            throw new common_1.BadRequestException('CSV must include a header row and at least one data row');
        }
        const headers = parsedRows[0].map(normalizeHeader);
        const dataRows = parsedRows.slice(1).map((row, index) => {
            const get = (header) => normalizeValue(row[headers.indexOf(header)]);
            const mapped = {
                lgaCode: get('lga_code'),
                lgaName: get('lga_name'),
                wardCode: get('ward_code'),
                wardName: get('ward_name'),
                pollingUnitCode: get('polling_unit_code'),
                pollingUnitName: get('polling_unit_name'),
                address: get('address'),
                registeredVoters: Number.parseInt(get('registered_voters') || '0', 10) || 0,
                lgaDescription: get('lga_description') || undefined,
                wardDescription: get('ward_description') || undefined,
            };
            const requiredValues = [
                ['lgaCode', 'lga_code'],
                ['lgaName', 'lga_name'],
                ['wardCode', 'ward_code'],
                ['wardName', 'ward_name'],
                ['pollingUnitCode', 'polling_unit_code'],
                ['pollingUnitName', 'polling_unit_name'],
                ['address', 'address'],
            ];
            for (const [key, label] of requiredValues) {
                if (!mapped[key]) {
                    throw new common_1.BadRequestException(`Row ${index + 2}: ${label} is required`);
                }
            }
            return mapped;
        });
        // Perform DB import using injected repositories
        if (replace) {
            await this.pollingUnitRepository.createQueryBuilder().delete().from(polling_unit_entity_1.PollingUnit).execute();
            await this.wardRepository.createQueryBuilder().delete().from(ward_entity_1.Ward).execute();
            await this.lgaRepository.createQueryBuilder().delete().from(lga_entity_1.LocalGovernmentArea).execute();
        }
        const lgaByCode = new Map((await this.lgaRepository.find()).map((lga) => [lga.code.trim().toUpperCase(), lga]));
        const wardByKey = new Map((await this.wardRepository.find()).map((ward) => [`${ward.lgaId}:${ward.code.trim().toUpperCase()}`, ward]));
        const pollingUnitByCode = new Map((await this.pollingUnitRepository.find()).map((pu) => [pu.code.trim().toUpperCase(), pu]));
        const stats = {
            lgasCreated: 0,
            lgasUpdated: 0,
            wardsCreated: 0,
            wardsUpdated: 0,
            pollingUnitsCreated: 0,
            pollingUnitsUpdated: 0,
        };
        for (const row of dataRows) {
            const lgaCode = row.lgaCode.toUpperCase();
            let lga = lgaByCode.get(lgaCode);
            if (!lga) {
                lga = this.lgaRepository.create({ code: lgaCode, name: row.lgaName, description: row.lgaDescription || undefined });
                lga = await this.lgaRepository.save(lga);
                lgaByCode.set(lgaCode, lga);
                stats.lgasCreated += 1;
            }
            else if (lga.name !== row.lgaName || (row.lgaDescription && lga.description !== row.lgaDescription)) {
                lga.name = row.lgaName;
                lga.description = row.lgaDescription || lga.description;
                lga = await this.lgaRepository.save(lga);
                lgaByCode.set(lgaCode, lga);
                stats.lgasUpdated += 1;
            }
            const wardCode = row.wardCode.toUpperCase();
            const wardKey = `${lga.id}:${wardCode}`;
            let ward = wardByKey.get(wardKey);
            if (!ward) {
                ward = this.wardRepository.create({ lgaId: lga.id, lga, code: wardCode, name: row.wardName, description: row.wardDescription || undefined });
                ward = await this.wardRepository.save(ward);
                wardByKey.set(wardKey, ward);
                stats.wardsCreated += 1;
            }
            else if (ward.name !== row.wardName || (row.wardDescription && ward.description !== row.wardDescription)) {
                ward.name = row.wardName;
                ward.description = row.wardDescription || ward.description;
                ward = await this.wardRepository.save(ward);
                wardByKey.set(wardKey, ward);
                stats.wardsUpdated += 1;
            }
            const pollingUnitCode = row.pollingUnitCode.toUpperCase();
            let pollingUnit = pollingUnitByCode.get(pollingUnitCode);
            if (!pollingUnit) {
                pollingUnit = this.pollingUnitRepository.create({
                    lgaId: lga.id,
                    wardId: ward.id,
                    lga,
                    ward,
                    code: pollingUnitCode,
                    name: row.pollingUnitName,
                    address: row.address,
                    registeredVoters: row.registeredVoters,
                });
                pollingUnit = await this.pollingUnitRepository.save(pollingUnit);
                pollingUnitByCode.set(pollingUnitCode, pollingUnit);
                stats.pollingUnitsCreated += 1;
            }
            else {
                const shouldUpdate = pollingUnit.name !== row.pollingUnitName ||
                    pollingUnit.address !== row.address ||
                    pollingUnit.registeredVoters !== row.registeredVoters ||
                    pollingUnit.lgaId !== lga.id ||
                    pollingUnit.wardId !== ward.id;
                if (shouldUpdate) {
                    pollingUnit.name = row.pollingUnitName;
                    pollingUnit.address = row.address;
                    pollingUnit.registeredVoters = row.registeredVoters;
                    pollingUnit.lgaId = lga.id;
                    pollingUnit.wardId = ward.id;
                    pollingUnit.lga = lga;
                    pollingUnit.ward = ward;
                    pollingUnit = await this.pollingUnitRepository.save(pollingUnit);
                    pollingUnitByCode.set(pollingUnitCode, pollingUnit);
                    stats.pollingUnitsUpdated += 1;
                }
            }
        }
        return { message: 'Location import completed successfully', stats };
    }
    // SUPPORTER STATS
    async getSupporterStats() {
        const now = new Date();
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const [total, verified, pending, rejected, thisMonth, lastMonth] = await Promise.all([
            this.supporterRepository.count(),
            this.supporterRepository.count({ where: { status: supporter_entity_1.VerificationStatus.VERIFIED } }),
            this.supporterRepository.count({ where: { status: supporter_entity_1.VerificationStatus.PENDING } }),
            this.supporterRepository.count({ where: { status: supporter_entity_1.VerificationStatus.REJECTED } }),
            this.supporterRepository
                .createQueryBuilder('supporter')
                .where('supporter.registeredAt >= :startOfThisMonth', { startOfThisMonth })
                .getCount(),
            this.supporterRepository
                .createQueryBuilder('supporter')
                .where('supporter.registeredAt >= :startOfLastMonth', { startOfLastMonth })
                .andWhere('supporter.registeredAt < :startOfThisMonth', { startOfThisMonth })
                .getCount(),
        ]);
        const growthRate = lastMonth > 0 ? Number((((thisMonth - lastMonth) / lastMonth) * 100).toFixed(2)) : 0;
        return {
            total,
            verified,
            pending,
            rejected,
            thisMonth,
            growthRate,
        };
    }
    // DASHBOARD STATS
    async getDashboardStats(requester) {
        const [userStats, agentStats, supporterStats, lgaCount, wardCount, puCount] = await Promise.all([
            this.getUserStats(),
            this.getAgentStats(),
            this.getSupporterStats(),
            this.lgaRepository.count(),
            this.wardRepository.count(),
            this.pollingUnitRepository.count(),
        ]);
        const supporters = await this.getDashboardSupporters(requester);
        const lgas = await this.lgaRepository.find();
        const lgaNameById = new Map(lgas.map((lga) => [lga.id, lga.name]));
        const registrationsByMonthMap = new Map();
        const registrationsByLgaMap = new Map();
        const genderDistributionMap = new Map();
        const ageDistributionMap = new Map([
            ['18-25', 0],
            ['26-35', 0],
            ['36-45', 0],
            ['46-55', 0],
            ['56+', 0],
        ]);
        const now = new Date();
        supporters.forEach((supporter) => {
            const registeredAt = new Date(supporter.registeredAt);
            const month = registeredAt.toLocaleString('en-US', { month: 'short' });
            const monthSortKey = registeredAt.getFullYear() * 12 + registeredAt.getMonth();
            const existingMonth = registrationsByMonthMap.get(month);
            registrationsByMonthMap.set(month, {
                month,
                registrations: (existingMonth?.registrations || 0) + 1,
                target: existingMonth?.target || 0,
                sortKey: monthSortKey,
            });
            const lgaName = lgaNameById.get(supporter.lga) || supporter.lga;
            registrationsByLgaMap.set(lgaName, (registrationsByLgaMap.get(lgaName) || 0) + 1);
            const gender = supporter.gender?.charAt(0).toUpperCase() + supporter.gender?.slice(1).toLowerCase();
            genderDistributionMap.set(gender, (genderDistributionMap.get(gender) || 0) + 1);
            const age = now.getFullYear() - new Date(supporter.dateOfBirth).getFullYear();
            const range = age <= 25 ? '18-25' : age <= 35 ? '26-35' : age <= 45 ? '36-45' : age <= 55 ? '46-55' : '56+';
            ageDistributionMap.set(range, (ageDistributionMap.get(range) || 0) + 1);
        });
        const registrationsByMonth = Array.from(registrationsByMonthMap.values())
            .sort((a, b) => a.sortKey - b.sortKey)
            .slice(-6)
            .map(({ sortKey, registrations, month }) => ({
            month,
            registrations,
            target: Math.max(registrations, 1),
        }));
        const registrationsByLga = Array.from(registrationsByLgaMap.entries())
            .map(([lga, count]) => ({ lga, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
        const genderDistribution = Array.from(genderDistributionMap.entries()).map(([gender, count]) => ({
            gender,
            count,
        }));
        const ageDistribution = Array.from(ageDistributionMap.entries()).map(([range, count]) => ({
            range,
            count,
        }));
        const recentActivities = supporters
            .flatMap((supporter) => {
            const supporterName = [supporter.firstName, supporter.lastName].filter(Boolean).join(' ');
            const registeredByName = [supporter.registeredByUser?.firstName, supporter.registeredByUser?.lastName]
                .filter(Boolean)
                .join(' ') || 'Unknown user';
            const lgaName = lgaNameById.get(supporter.lga) || supporter.lga;
            const location = [supporter.pollingUnit, supporter.ward, lgaName, supporter.state]
                .filter(Boolean)
                .join(', ');
            const items = [
                {
                    id: `registered-${supporter.id}`,
                    type: 'registration',
                    user: supporterName,
                    action: `was registered by ${registeredByName}`,
                    location,
                    timestamp: supporter.registeredAt,
                },
            ];
            if (supporter.verifiedAt && supporter.status === supporter_entity_1.VerificationStatus.VERIFIED) {
                items.push({
                    id: `verified-${supporter.id}`,
                    type: 'verification',
                    user: supporterName,
                    action: 'was verified',
                    location,
                    timestamp: supporter.verifiedAt,
                });
            }
            if (supporter.verifiedAt && supporter.status === supporter_entity_1.VerificationStatus.REJECTED) {
                items.push({
                    id: `rejected-${supporter.id}`,
                    type: 'rejected',
                    user: supporterName,
                    action: 'was rejected during review',
                    location,
                    timestamp: supporter.verifiedAt,
                });
            }
            if (supporter.status === supporter_entity_1.VerificationStatus.PENDING) {
                items.push({
                    id: `pending-${supporter.id}`,
                    type: 'pending',
                    user: supporterName,
                    action: 'is pending review',
                    location,
                    timestamp: supporter.registeredAt,
                });
            }
            return items;
        })
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 8)
            .map((item) => ({
            ...item,
            timestamp: item.timestamp,
        }));
        return {
            users: userStats,
            agents: agentStats,
            supporters: supporterStats,
            registrationsByMonth,
            registrationsByLga,
            genderDistribution,
            ageDistribution,
            recentActivities,
            geography: {
                lgas: lgaCount,
                wards: wardCount,
                pollingUnits: puCount,
            },
        };
    }
    async getDashboardSupporters(requester) {
        const query = this.supporterRepository
            .createQueryBuilder('supporter')
            .leftJoinAndSelect('supporter.registeredByUser', 'registeredByUser')
            .orderBy('supporter.registeredAt', 'ASC');
        if (!requester || requester.role === user_role_enum_1.UserRole.SUPER_ADMIN) {
            return query.getMany();
        }
        if (requester.role === user_role_enum_1.UserRole.FIELD_AGENT) {
            query.where('supporter.registeredByUserId = :userId', { userId: requester.id });
            return query.getMany();
        }
        if (requester.role === user_role_enum_1.UserRole.SUPERVISOR) {
            const supervisorAgent = await this.agentRepository.findOne({
                where: { userId: requester.id, role: user_role_enum_1.UserRole.SUPERVISOR },
            });
            if (!supervisorAgent) {
                return [];
            }
            query
                .innerJoin(agent_entity_1.Agent, 'registeredAgent', 'registeredAgent.userId = supporter.registeredByUserId')
                .where('registeredAgent.role = :fieldAgentRole', { fieldAgentRole: user_role_enum_1.UserRole.FIELD_AGENT })
                .andWhere('registeredAgent.lga = :supervisorLga', { supervisorLga: supervisorAgent.lga });
            return query.getMany();
        }
        return [];
    }
    // GET LOCATION DATA IN HIERARCHICAL FORMAT
    async getLocationHierarchy() {
        const lgas = await this.lgaRepository.find({
            relations: ['wards'],
            order: { name: 'ASC' },
        });
        const wards = await this.wardRepository.find({
            relations: ['lga', 'pollingUnits'],
            order: { name: 'ASC' },
        });
        const pollingUnits = await this.pollingUnitRepository.find({
            relations: ['ward', 'lga'],
            order: { name: 'ASC' },
        });
        return {
            lgas,
            wards,
            pollingUnits,
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(agent_entity_1.Agent)),
    __param(2, (0, typeorm_1.InjectRepository)(lga_entity_1.LocalGovernmentArea)),
    __param(3, (0, typeorm_1.InjectRepository)(ward_entity_1.Ward)),
    __param(4, (0, typeorm_1.InjectRepository)(polling_unit_entity_1.PollingUnit)),
    __param(5, (0, typeorm_1.InjectRepository)(supporter_entity_1.Supporter)),
    __param(6, (0, typeorm_1.InjectRepository)(registration_entity_1.Registration)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map