import { Repository } from 'typeorm';
import { Agent } from '@/entities/agent.entity';
import { Supporter, VerificationStatus } from '@/entities/supporter.entity';
import { UserRole } from '@/entities/user-role.enum';
import { CreateSupporterDto, UpdateSupporterDto, VerifySupporterDto } from './dto';
export declare class SupporterService {
    private supporterRepository;
    private agentRepository;
    constructor(supporterRepository: Repository<Supporter>, agentRepository: Repository<Agent>);
    create(createSupporterDto: CreateSupporterDto, registeredByUserId: string): Promise<Supporter>;
    findById(id: string): Promise<Supporter>;
    findAll(skip?: number, take?: number, filters?: {
        state?: string;
        lga?: string;
        status?: VerificationStatus;
        search?: string;
    }, requester?: {
        id: string;
        role: UserRole;
    }): Promise<[Supporter[], number]>;
    update(id: string, updateSupporterDto: UpdateSupporterDto): Promise<Supporter>;
    verify(id: string, verifySupporterDto: VerifySupporterDto, verifiedByUserId: string): Promise<Supporter>;
    findByIdForRequester(id: string, requester: {
        id: string;
        role: UserRole;
    }): Promise<Supporter>;
    verifyForRequester(id: string, verifySupporterDto: VerifySupporterDto, requester: {
        id: string;
        role: UserRole;
    }): Promise<Supporter>;
    getStatistics(): Promise<{
        total: number;
        verified: number;
        pending: number;
        rejected: number;
        verificationRate: string | number;
    }>;
    getStatisticsByLocation(state: string, lga?: string): Promise<{
        state: string;
        lga: string | null;
        total: number;
        verified: number;
        pending: number;
        verificationRate: string | number;
    }>;
    delete(id: string): Promise<void>;
    private findSupervisorAgentByUserId;
    private assertSupervisorCanAccessSupporter;
}
//# sourceMappingURL=supporters.service.d.ts.map