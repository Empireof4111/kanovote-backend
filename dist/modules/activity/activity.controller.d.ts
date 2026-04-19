import { ActivityService } from './activity.service';
import { ActivityAction } from '@/entities/activity-log.entity';
export declare class ActivityController {
    private activityService;
    constructor(activityService: ActivityService);
    getRecentActivity(limit?: string): Promise<import("@/entities/activity-log.entity").ActivityLog[]>;
    getAuditLog(skip?: string, take?: string, userId?: string, action?: ActivityAction): Promise<{
        logs: import("@/entities/activity-log.entity").ActivityLog[];
        total: number;
    }>;
    findByUser(userId: string, skip?: string, take?: string): Promise<{
        logs: import("@/entities/activity-log.entity").ActivityLog[];
        total: number;
    }>;
    findByEntity(entityType: string, entityId: string): Promise<import("@/entities/activity-log.entity").ActivityLog[]>;
}
//# sourceMappingURL=activity.controller.d.ts.map