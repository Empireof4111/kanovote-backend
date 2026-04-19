import { Repository } from 'typeorm';
import { ActivityLog, ActivityAction } from '@/entities/activity-log.entity';
export declare class ActivityService {
    private activityRepository;
    constructor(activityRepository: Repository<ActivityLog>);
    log(userId: string, action: ActivityAction, entityType?: string, entityId?: string, details?: string, ipAddress?: string, userAgent?: string): Promise<ActivityLog>;
    findByUser(userId: string, skip?: number, take?: number): Promise<any>;
    findByAction(action: ActivityAction, skip?: number, take?: number): Promise<any>;
    findByEntity(entityType: string, entityId: string): Promise<any>;
    getRecentActivity(limit?: number): Promise<any>;
    getAuditLog(skip?: number, take?: number, filters?: {
        userId?: string;
        action?: ActivityAction;
    }): Promise<any>;
}
//# sourceMappingURL=activity.service.d.ts.map