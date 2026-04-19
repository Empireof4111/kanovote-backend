import { Repository } from 'typeorm';
import { Registration, RegistrationStatus } from '@/entities/registration.entity';
export declare class RegistrationService {
    private registrationRepository;
    constructor(registrationRepository: Repository<Registration>);
    create(agentId: string, supporterId: string): Promise<Registration>;
    findById(id: string): Promise<Registration>;
    findByAgentId(agentId: string, skip?: number, take?: number): Promise<[Registration[], number]>;
    findBySupporterId(supporterId: string): Promise<Registration[]>;
    updateStatus(id: string, status: RegistrationStatus): Promise<Registration>;
    getRegistrationStats(): Promise<{
        total: number;
        initiated: number;
        inProgress: number;
        completed: number;
        verified: number;
        rejected: number;
    }>;
}
//# sourceMappingURL=registrations.service.d.ts.map