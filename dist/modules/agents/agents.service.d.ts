import { Repository } from 'typeorm';
import { Agent, AgentStatus } from '@/entities/agent.entity';
import { User } from '@/entities/user.entity';
import { CreateAgentDto, UpdateAgentDto, AgentPerformanceDto } from './dto';
export declare class AgentService {
    private agentRepository;
    private userRepository;
    constructor(agentRepository: Repository<Agent>, userRepository: Repository<User>);
    create(createAgentDto: CreateAgentDto): Promise<Agent>;
    findById(id: string): Promise<Agent>;
    findByUserId(userId: string): Promise<Agent | null>;
    findAll(skip?: number, take?: number, filters?: AgentPerformanceDto): Promise<any>;
    update(id: string, updateAgentDto: UpdateAgentDto): Promise<Agent>;
    updateRegistrationStats(agentId: string): Promise<void>;
    getPerformanceReport(agentId: string): Promise<{
        agentId: string;
        agentName: string;
        role: import("@/entities/user.entity").UserRole;
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
        status: AgentStatus;
    }>;
    deactivate(id: string): Promise<Agent>;
    suspend(id: string): Promise<Agent>;
    activate(id: string): Promise<Agent>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=agents.service.d.ts.map