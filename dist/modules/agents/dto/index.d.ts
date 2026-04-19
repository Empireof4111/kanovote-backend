import { UserRole } from '@/entities/user.entity';
import { AgentStatus } from '@/entities/agent.entity';
export declare class CreateAgentDto {
    userId: string;
    role: UserRole;
    state: string;
    lga: string;
    ward: string;
    notes?: string;
}
export declare class UpdateAgentDto {
    state?: string;
    lga?: string;
    ward?: string;
    status?: AgentStatus;
    notes?: string;
}
export declare class AgentPerformanceDto {
    skip?: number;
    take?: number;
    state?: string;
    lga?: string;
}
//# sourceMappingURL=index.d.ts.map