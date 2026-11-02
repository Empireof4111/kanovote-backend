import { Repository } from 'typeorm';
import { Agent, AgentStatus } from '@/entities/agent.entity';
import { Registration } from '@/entities/registration.entity';
import { User } from '@/entities/user.entity';
import { UserRole } from '@/entities/user-role.enum';
import { Ward } from '@/entities/ward.entity';
import { CreateAgentDto, UpdateAgentDto, AgentPerformanceDto, RegisterAgentDto, ResetPasswordDto } from './dto';
export declare class AgentService {
    private agentRepository;
    private registrationRepository;
    private userRepository;
    private wardRepository;
    constructor(agentRepository: Repository<Agent>, registrationRepository: Repository<Registration>, userRepository: Repository<User>, wardRepository: Repository<Ward>);
    registerAgent(registerAgentDto: RegisterAgentDto, requester: {
        id: string;
        role: UserRole;
    }): Promise<{
        agent: Agent;
        user: User;
    }>;
    create(createAgentDto: CreateAgentDto): Promise<Agent>;
    findById(id: string): Promise<Agent>;
    findByUserId(userId: string): Promise<Agent | null>;
    findAll(skip?: number, take?: number, filters?: AgentPerformanceDto, requester?: {
        id: string;
        role: UserRole;
    }): Promise<readonly [Agent[], number]>;
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
    private attachRegistrationStats;
}
//# sourceMappingURL=agents.service.d.ts.map