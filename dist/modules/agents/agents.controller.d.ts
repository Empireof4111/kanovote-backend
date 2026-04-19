import { AgentService } from './agents.service';
import { UserRole } from '@/entities/user.entity';
import { CreateAgentDto, UpdateAgentDto, AgentPerformanceDto, RegisterAgentDto, ResetPasswordDto } from './dto';
export declare class AgentController {
    private agentService;
    constructor(agentService: AgentService);
    registerAgent(registerAgentDto: RegisterAgentDto): Promise<{
        agent: import("../../entities/agent.entity").Agent;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            username: string;
            role: UserRole;
            phone: string;
            profileImage: string;
            isActive: boolean;
            isEmailVerified: boolean;
            emailVerificationToken: string;
            emailVerifiedAt: Date;
            resetPasswordToken: string;
            resetPasswordTokenExpiry: Date;
            lastLoginAt: Date;
            createdAt: Date;
            updatedAt: Date;
            agents: import("../../entities/agent.entity").Agent[];
            registeredSupporters: import("../../entities/supporter.entity").Supporter[];
            activityLogs: import("../../entities/activity-log.entity").ActivityLog[];
        };
    }>;
    create(createAgentDto: CreateAgentDto): Promise<import("../../entities/agent.entity").Agent>;
    findAll(query: AgentPerformanceDto): Promise<{
        agents: import("../../entities/agent.entity").Agent[];
        total: number;
    }>;
    findByUserId(userId: string): Promise<import("../../entities/agent.entity").Agent | null>;
    findById(id: string): Promise<import("../../entities/agent.entity").Agent>;
    getPerformanceReport(id: string): Promise<{
        agentId: string;
        agentName: string;
        role: UserRole;
        state: string;
        lga: string;
        ward: string;
        totalRegistrations: number;
        verifiedRegistrations: number;
        pendingRegistrations: number;
        rejectedRegistrations: number;
        verificationRate: string | number;
        joinedAt: Date;
        lastActivityAt: Date;
        status: import("../../entities/agent.entity").AgentStatus;
    }>;
    update(id: string, updateAgentDto: UpdateAgentDto): Promise<import("../../entities/agent.entity").Agent>;
    resetPassword(id: string, resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    activate(id: string): Promise<import("../../entities/agent.entity").Agent>;
    deactivate(id: string): Promise<import("../../entities/agent.entity").Agent>;
    suspend(id: string): Promise<import("../../entities/agent.entity").Agent>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=agents.controller.d.ts.map