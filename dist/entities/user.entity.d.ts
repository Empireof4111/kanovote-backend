import { Agent } from './agent.entity';
import { Supporter } from './supporter.entity';
import { ActivityLog } from './activity-log.entity';
export declare enum UserRole {
    SUPER_ADMIN = "super_admin",
    SUPERVISOR = "supervisor",
    FIELD_AGENT = "field_agent"
}
export declare class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
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
    agents: Agent[];
    registeredSupporters: Supporter[];
    activityLogs: ActivityLog[];
}
//# sourceMappingURL=user.entity.d.ts.map