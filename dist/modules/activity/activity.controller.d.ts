import { ActivityService } from './activity.service';
import { ActivityAction } from '@/entities/activity-log.entity';
export declare class ActivityController {
    private activityService;
    constructor(activityService: ActivityService);
    getRecentActivity(limit?: string): Promise<any>;
    getAuditLog(skip?: string, take?: string, userId?: string, action?: ActivityAction): Promise<{
        logs: any;
        total: any;
    }>;
    findByUser(userId: string, skip?: string, take?: string): Promise<{
        logs: any;
        total: any;
    }>;
    findByEntity(entityType: string, entityId: string): Promise<any>;
}
//# sourceMappingURL=activity.controller.d.ts.map