import { Repository } from 'typeorm';
import { User, UserRole } from '@/entities/user.entity';
import { Agent } from '@/entities/agent.entity';
export declare class AdminService {
    private userRepository;
    private agentRepository;
    constructor(userRepository: Repository<User>, agentRepository: Repository<Agent>);
    getAllUsers(skip?: number, take?: number, role?: UserRole): Promise<any>;
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
    updateUserRole(userId: string, newRole: UserRole): Promise<User>;
    blockUser(userId: string): Promise<User>;
    unblockUser(userId: string): Promise<User>;
    getDashboardStats(): Promise<{
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
}
//# sourceMappingURL=admin.service.d.ts.map