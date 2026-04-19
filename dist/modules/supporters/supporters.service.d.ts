import { Repository } from 'typeorm';
import { Supporter, VerificationStatus } from '@/entities/supporter.entity';
import { CreateSupporterDto, UpdateSupporterDto, VerifySupporterDto } from './dto';
export declare class SupporterService {
    private supporterRepository;
    constructor(supporterRepository: Repository<Supporter>);
    create(createSupporterDto: CreateSupporterDto, registeredByUserId: string): Promise<Supporter>;
    findById(id: string): Promise<Supporter>;
    findAll(skip?: number, take?: number, filters?: {
        state?: string;
        lga?: string;
        status?: VerificationStatus;
        search?: string;
    }): Promise<any>;
    update(id: string, updateSupporterDto: UpdateSupporterDto): Promise<Supporter>;
    verify(id: string, verifySupporterDto: VerifySupporterDto, verifiedByUserId: string): Promise<Supporter>;
    getStatistics(): Promise<{
        total: any;
        verified: any;
        pending: any;
        rejected: any;
        verificationRate: string | number;
    }>;
    getStatisticsByLocation(state: string, lga?: string): Promise<{
        state: string;
        lga: string | null;
        total: any;
        verified: any;
        pending: any;
        verificationRate: string | number;
    }>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=supporters.service.d.ts.map