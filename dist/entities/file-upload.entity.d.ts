import { Supporter } from './supporter.entity';
import { User } from './user.entity';
export declare enum FileType {
    VOTER_CARD = "voter_card",
    IDENTITY_CARD = "identity_card",
    PASSPORT = "passport",
    DRIVER_LICENSE = "driver_license",
    UTILITY_BILL = "utility_bill",
    OTHER = "other"
}
export declare class FileUpload {
    id: string;
    supporterId: string;
    supporter: Supporter;
    uploadedByUserId: string;
    uploadedByUser: User;
    fileType: FileType;
    fileName: string;
    filePath: string;
    mimeType: string;
    fileSize: number;
    url: string;
    isActive: boolean;
    createdAt: Date;
}
//# sourceMappingURL=file-upload.entity.d.ts.map