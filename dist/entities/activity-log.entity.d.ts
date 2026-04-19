import { User } from './user.entity';
export declare enum ActivityAction {
    LOGIN = "login",
    LOGOUT = "logout",
    CREATE_SUPPORTER = "create_supporter",
    UPDATE_SUPPORTER = "update_supporter",
    VERIFY_SUPPORTER = "verify_supporter",
    REJECT_SUPPORTER = "reject_supporter",
    UPLOAD_DOCUMENT = "upload_document",
    DOWNLOAD_EXPORT = "download_export",
    CREATE_AGENT = "create_agent",
    UPDATE_AGENT = "update_agent",
    DELETE_AGENT = "delete_agent",
    VIEW_REPORT = "view_report",
    UPDATE_SETTINGS = "update_settings"
}
export declare class ActivityLog {
    id: string;
    userId: string;
    user: User;
    action: ActivityAction;
    entityType: string;
    entityId: string;
    details: string;
    ipAddress: string;
    userAgent: string;
    createdAt: Date;
}
//# sourceMappingURL=activity-log.entity.d.ts.map