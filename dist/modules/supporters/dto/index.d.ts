import { VerificationStatus } from '@/entities/supporter.entity';
export declare class CreateSupporterDto {
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    occupation: string;
    state: string;
    lga: string;
    ward: string;
    pollingUnit: string;
    address: string;
    voterCardNumber: string;
}
export declare class UpdateSupporterDto {
    occupation?: string;
    pollingUnit?: string;
    address?: string;
    status?: VerificationStatus;
    verificationNotes?: string;
}
export declare class VerifySupporterDto {
    status: VerificationStatus;
    notes?: string;
}
//# sourceMappingURL=index.d.ts.map