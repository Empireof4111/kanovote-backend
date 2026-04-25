import { UserRole } from '@/entities/user-role.enum';
import { AgentStatus } from '@/entities/agent.entity';
export declare class RegisterAgentDto {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    role: UserRole;
    state: string;
    lga: string;
    ward: string;
    notes?: string;
}
export declare class CreateAgentDto {
    userId: string;
    role: UserRole;
    state: string;
    lga: string;
    ward: string;
    notes?: string;
}
export declare class UpdateAgentDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    state?: string;
    lga?: string;
    ward?: string;
    status?: AgentStatus;
    notes?: string;
}
export declare class ResetPasswordDto {
    newPassword: string;
    confirmPassword: string;
}
export declare class AgentPerformanceDto {
    skip?: number;
    take?: number;
    state?: string;
    lga?: string;
    role?: string;
    status?: string;
}
//# sourceMappingURL=index.d.ts.map