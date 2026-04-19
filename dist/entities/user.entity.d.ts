import { Agent } from './agent.entity';
import { Supporter } from './supporter.entity';
import { ActivityLog } from './activity-log.entity';
import { UserRole } from './user-role.enum';
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