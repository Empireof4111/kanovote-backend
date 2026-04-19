import { User, UserRole } from './user.entity';
import { Registration } from './registration.entity';
export declare enum AgentStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended"
}
export declare class Agent {
    id: string;
    userId: string;
    user: User;
    role: UserRole;
    state: string;
    lga: string;
    ward: string;
    totalRegistrations: number;
    verifiedRegistrations: number;
    pendingRegistrations: number;
    rejectedRegistrations: number;
    status: AgentStatus;
    notes: string;
    lastActivityAt: Date;
    joinedAt: Date;
    updatedAt: Date;
    registrations: Registration[];
}
//# sourceMappingURL=agent.entity.d.ts.map