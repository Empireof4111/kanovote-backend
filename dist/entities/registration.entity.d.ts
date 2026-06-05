import { Agent } from './agent.entity';
import { Supporter } from './supporter.entity';
import { BaseUuidEntity } from './base-uuid.entity';
export declare enum RegistrationStatus {
    INITIATED = "initiated",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    VERIFIED = "verified",
    REJECTED = "rejected"
}
export declare class Registration extends BaseUuidEntity {
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