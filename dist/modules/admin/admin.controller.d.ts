import { AdminService } from './admin.service';
import { UserRole } from '@/entities/user-role.enum';
import { CreateLgaDto, CreateWardDto, CreatePollingUnitDto, UpdateLgaDto, UpdateWardDto, UpdatePollingUnitDto, UpdateUserRoleDto } from './dto';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    getDashboard(): Promise<{
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
            thisMonth: number;
            growthRate: number;
        };
        registrationsByMonth: {
            month: string;
            registrations: number;
            target: number;
        }[];
        registrationsByLga: {
            lga: string;
            count: number;
        }[];
        genderDistribution: {
            gender: string;
            count: number;
        }[];
        ageDistribution: {
            range: string;
            count: number;
        }[];
        geography: {
            lgas: number;
            wards: number;
            pollingUnits: number;
        };
    }>;
    getAllUsers(skip?: string, take?: string, role?: UserRole): Promise<{
        users: import("../../entities/user.entity").User[];
        total: number;
    }>;
    getUserStats(): Promise<{
        total: number;
        superAdmins: number;
        supervisors: number;
        fieldAgents: number;
    }>;
    updateUserRole(userId: string, updateUserRoleDto: UpdateUserRoleDto): Promise<import("../../entities/user.entity").User>;
    blockUser(userId: string): Promise<import("../../entities/user.entity").User>;
    unblockUser(userId: string): Promise<import("../../entities/user.entity").User>;
    getAgentStats(): Promise<{
        total: number;
        active: number;
        inactive: number;
        suspended: number;
    }>;
    createLga(createLgaDto: CreateLgaDto): Promise<import("../../entities/lga.entity").LocalGovernmentArea>;
    getAllLgas(skip?: string, take?: string): Promise<{
        lgas: import("../../entities/lga.entity").LocalGovernmentArea[];
        total: number;
    }>;
    getLgaById(id: string): Promise<import("../../entities/lga.entity").LocalGovernmentArea>;
    updateLga(id: string, updateLgaDto: UpdateLgaDto): Promise<import("../../entities/lga.entity").LocalGovernmentArea>;
    deleteLga(id: string): Promise<void>;
    createWard(createWardDto: CreateWardDto): Promise<import("../../entities/ward.entity").Ward>;
    getAllWards(lgaId?: string, skip?: string, take?: string): Promise<{
        wards: import("../../entities/ward.entity").Ward[];
        total: number;
    }>;
    getWardById(id: string): Promise<import("../../entities/ward.entity").Ward>;
    updateWard(id: string, updateWardDto: UpdateWardDto): Promise<import("../../entities/ward.entity").Ward>;
    deleteWard(id: string): Promise<void>;
    createPollingUnit(createPollingUnitDto: CreatePollingUnitDto): Promise<import("../../entities/polling-unit.entity").PollingUnit>;
    getAllPollingUnits(wardId?: string, lgaId?: string, skip?: string, take?: string): Promise<{
        pollingUnits: import("../../entities/polling-unit.entity").PollingUnit[];
        total: number;
    }>;
    getPollingUnitById(id: string): Promise<import("../../entities/polling-unit.entity").PollingUnit>;
    updatePollingUnit(id: string, updatePollingUnitDto: UpdatePollingUnitDto): Promise<import("../../entities/polling-unit.entity").PollingUnit>;
    deletePollingUnit(id: string): Promise<void>;
    getLocationHierarchy(): Promise<{
        lgas: import("../../entities/lga.entity").LocalGovernmentArea[];
        wards: import("../../entities/ward.entity").Ward[];
        pollingUnits: import("../../entities/polling-unit.entity").PollingUnit[];
    }>;
}
//# sourceMappingURL=admin.controller.d.ts.map