import { UserRole } from '@/entities/user-role.enum';
export declare class CreateLgaDto {
    name: string;
    code: string;
    description?: string;
}
export declare class CreateWardDto {
    lgaId: string;
    name: string;
    code: string;
    description?: string;
}
export declare class CreatePollingUnitDto {
    wardId: string;
    lgaId: string;
    name: string;
    code: string;
    address: string;
    registeredVoters?: number;
}
export declare class UpdateLgaDto {
    name?: string;
    code?: string;
    description?: string;
}
export declare class UpdateWardDto {
    name?: string;
    code?: string;
    description?: string;
}
export declare class UpdatePollingUnitDto {
    name?: string;
    code?: string;
    address?: string;
    registeredVoters?: number;
}
export declare class UpdateUserRoleDto {
    role: UserRole;
}
export declare class DashboardStatsDto {
    totalUsers: number;
    totalAgents: number;
    totalSupporters: number;
    totalRegistrations: number;
}
//# sourceMappingURL=index.d.ts.map