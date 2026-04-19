import { Repository } from 'typeorm';
import { ActivityLog, ActivityAction } from '@/entities/activity-log.entity';
export declare class ActivityService {
    private activityRepository;
    constructor(activityRepository: Repository<ActivityLog>);
    log(userId: string, action: ActivityAction, entityType?: string, entityId?: string, details?: string, ipAddress?: string, userAgent?: string): Promise<ActivityLog>;
    findByUser(userId: string, skip?: number, take?: number): Promise<[ActivityLog[], number]>;
    findByAction(action: ActivityAction, skip?: number, take?: number): Promise<[ActivityLog[], number]>;
    findByEntity(entityType: string, entityId: string): Promise<ActivityLog[]>;
    getRecentActivity(limit?: number): Promise<ActivityLog[]>;
    getAuditLog(skip?: number, take?: number, filters?: {
        userId?: string;
        action?: ActivityAction;
    }): Promise<[ActivityLog[], number]>;
}
//# sourceMappingURL=activity.service.d.ts.map