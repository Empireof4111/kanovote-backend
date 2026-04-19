import { AgentService } from './agents.service';
import { UserRole } from '@/entities/user.entity';
import { CreateAgentDto, UpdateAgentDto, AgentPerformanceDto } from './dto';
export declare class AgentController {
    private agentService;
    constructor(agentService: AgentService);
    create(createAgentDto: CreateAgentDto): Promise<import("../../entities/agent.entity").Agent>;
    findAll(query: AgentPerformanceDto): Promise<{
        agents: any;
        total: any;
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
    activate(id: string): Promise<import("../../entities/agent.entity").Agent>;
    deactivate(id: string): Promise<import("../../entities/agent.entity").Agent>;
    suspend(id: string): Promise<import("../../entities/agent.entity").Agent>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=agents.controller.d.ts.map