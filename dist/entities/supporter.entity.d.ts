import { User } from './user.entity';
import { Registration } from './registration.entity';
export declare enum VerificationStatus {
    PENDING = "pending",
    VERIFIED = "verified",
    REJECTED = "rejected"
}
export declare class Supporter {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: Date;
    gender: string;
    occupation: string;
    state: string;
    lga: string;
    ward: string;
    pollingUnit: string;
    address: string;
    voterCardNumber: string;
    status: VerificationStatus;
    registeredByUserId: string;
    registeredByUser: User;
    verificationNotes: string;
    verifiedByUserId: string;
    verifiedAt: Date;
    documentUploaded: boolean;
    documentUrl: string | null;
    registeredAt: Date;
    updatedAt: Date;
    registrations: Registration[];
}
//# sourceMappingURL=supporter.entity.d.ts.map