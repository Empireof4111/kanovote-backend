import { Repository } from 'typeorm';
import { User, UserRole } from '@/entities/user.entity';
import { Agent } from '@/entities/agent.entity';
import { LocalGovernmentArea } from '@/entities/lga.entity';
import { Ward } from '@/entities/ward.entity';
import { PollingUnit } from '@/entities/polling-unit.entity';
import { Supporter } from '@/entities/supporter.entity';
import { Registration } from '@/entities/registration.entity';
import { CreateLgaDto, CreateWardDto, CreatePollingUnitDto, UpdateLgaDto, UpdateWardDto, UpdatePollingUnitDto, UpdateUserRoleDto } from './dto';
export declare class AdminService {
    private userRepository;
    private agentRepository;
    private lgaRepository;
    private wardRepository;
    private pollingUnitRepository;
    private supporterRepository;
    private registrationRepository;
    constructor(userRepository: Repository<User>, agentRepository: Repository<Agent>, lgaRepository: Repository<LocalGovernmentArea>, wardRepository: Repository<Ward>, pollingUnitRepository: Repository<PollingUnit>, supporterRepository: Repository<Supporter>, registrationRepository: Repository<Registration>);
    getAllUsers(skip?: number, take?: number, role?: UserRole): Promise<[User[], number]>;
    getUserStats(): Promise<{
        total: number;
        superAdmins: number;
        supervisors: number;
        fieldAgents: number;
    }>;
    updateUserRole(userId: string, updateUserRoleDto: UpdateUserRoleDto): Promise<User>;
    blockUser(userId: string): Promise<User>;
    unblockUser(userId: string): Promise<User>;
    getAgentStats(): Promise<{
        total: number;
        active: number;
        inactive: number;
        suspended: number;
    }>;
    createLga(createLgaDto: CreateLgaDto): Promise<LocalGovernmentArea>;
    getAllLgas(skip?: number, take?: number): Promise<[LocalGovernmentArea[], number]>;
    getLgaById(id: string): Promise<LocalGovernmentArea>;
    updateLga(id: string, updateLgaDto: UpdateLgaDto): Promise<LocalGovernmentArea>;
    deleteLga(id: string): Promise<void>;
    createWard(createWardDto: CreateWardDto): Promise<Ward>;
    getAllWards(lgaId?: string, skip?: number, take?: number): Promise<[Ward[], number]>;
    getWardById(id: string): Promise<Ward>;
    updateWard(id: string, updateWardDto: UpdateWardDto): Promise<Ward>;
    deleteWard(id: string): Promise<void>;
    createPollingUnit(createPollingUnitDto: CreatePollingUnitDto): Promise<PollingUnit>;
    getAllPollingUnits(wardId?: string, lgaId?: string, skip?: number, take?: number): Promise<[PollingUnit[], number]>;
    getPollingUnitById(id: string): Promise<PollingUnit>;
    updatePollingUnit(id: string, updatePollingUnitDto: UpdatePollingUnitDto): Promise<PollingUnit>;
    deletePollingUnit(id: string): Promise<void>;
    getSupporterStats(): Promise<{
        total: number;
        verified: number;
        pending: number;
        rejected: number;
    }>;
    getDashboardStats(): Promise<{
        users: {
            total: number;
            superAdmins: number;
            supervisors: number;
            fieldAgents: number;
        };
        agents: {
            total: number;
            active: number;
            inactive: number;
            suspended: number;
        };
        supporters: {
            total: number;
            verified: number;
            pending: number;
            rejected: number;
        };
        geography: {
            lgas: number;
            wards: number;
            pollingUnits: number;
        };
    }>;
    getLocationHierarchy(): Promise<{
        lgas: LocalGovernmentArea[];
        wards: Ward[];
        pollingUnits: PollingUnit[];
    }>;
}
//# sourceMappingURL=admin.service.d.ts.map