import { Agent } from './agent.entity';
import { Supporter } from './supporter.entity';
export declare enum RegistrationStatus {
    INITIATED = "initiated",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    VERIFIED = "verified",
    REJECTED = "rejected"
}
export declare class Registration {
    id: string;
    agentId: string;
    agent: Agent;
    supporterId: string;
    supporter: Supporter;
    status: RegistrationStatus;
    completionPercentage: number;
    notes: string;
    verifiedByUserId: string;
    verifiedAt: Date;
    completedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=registration.entity.d.ts.map