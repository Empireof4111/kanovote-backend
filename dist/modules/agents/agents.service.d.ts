import { Repository } from 'typeorm';
import { Agent, AgentStatus } from '@/entities/agent.entity';
import { User } from '@/entities/user.entity';
import { UserRole } from '@/entities/user-role.enum';
import { CreateAgentDto, UpdateAgentDto, AgentPerformanceDto, RegisterAgentDto, ResetPasswordDto } from './dto';
export declare class AgentService {
    private agentRepository;
    private userRepository;
    constructor(agentRepository: Repository<Agent>, userRepository: Repository<User>);
    registerAgent(registerAgentDto: RegisterAgentDto): Promise<{
        agent: Agent;
        user: User;
    }>;
    create(createAgentDto: CreateAgentDto): Promise<Agent>;
    findById(id: string): Promise<Agent>;
    findByUserId(userId: string): Promise<Agent | null>;
    findAll(skip?: number, take?: number, filters?: AgentPerformanceDto, requester?: {
        id: string;
        role: UserRole;
    }): Promise<[Agent[], number]>;
    findByIdForRequester(id: string, requester: {
        id: string;
        role: UserRole;
    }): Promise<Agent>;
    update(id: string, updateAgentDto: UpdateAgentDto): Promise<Agent>;
    resetPassword(userId: string, resetPasswordDto: ResetPasswordDto): Promise<void>;
    updateRegistrationStats(agentId: string): Promise<void>;
    getPerformanceReport(agentId: string): Promise<{
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
        status: AgentStatus;
    }>;
    deactivate(id: string): Promise<Agent>;
    suspend(id: string): Promise<Agent>;
    activate(id: string): Promise<Agent>;
    delete(id: string): Promise<void>;
    private findSupervisorAgentByUserId;
    private assertSupervisorCanAccessAgent;
}
//# sourceMappingURL=agents.service.d.ts.map