import { AdminService } from './admin.service';
import { UserRole } from '@/entities/user.entity';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    getDashboard(): Promise<{
        users: {
            total: any;
            superAdmins: any;
            supervisors: any;
            fieldAgents: any;
        };
        agents: {
            total: any;
            active: any;
            inactive: any;
            suspended: any;
        };
    }>;
    getAllUsers(skip?: string, take?: string, role?: UserRole): Promise<{
        users: any;
        total: any;
    }>;
    getUserStats(): Promise<{
        total: any;
        superAdmins: any;
        supervisors: any;
        fieldAgents: any;
    }>;
    getAgentStats(): Promise<{
        total: any;
        active: any;
        inactive: any;
        suspended: any;
    }>;
    updateUserRole(userId: string, { role }: {
        role: UserRole;
    }): Promise<import("@/entities/user.entity").User>;
    blockUser(userId: string): Promise<import("@/entities/user.entity").User>;
    unblockUser(userId: string): Promise<import("@/entities/user.entity").User>;
}
//# sourceMappingURL=admin.controller.d.ts.map