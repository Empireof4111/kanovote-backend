import { Repository } from 'typeorm';
import { Registration, RegistrationStatus } from '@/entities/registration.entity';
export declare class RegistrationService {
    private registrationRepository;
    constructor(registrationRepository: Repository<Registration>);
    create(agentId: string, supporterId: string): Promise<Registration>;
    findById(id: string): Promise<Registration>;
    findByAgentId(agentId: string, skip?: number, take?: number): Promise<any>;
    findBySupporterId(supporterId: string): Promise<any>;
    updateStatus(id: string, status: RegistrationStatus): Promise<Registration>;
    getRegistrationStats(): Promise<{
        total: any;
        initiated: any;
        inProgress: any;
        completed: any;
        verified: any;
        rejected: any;
    }>;
}
//# sourceMappingURL=registrations.service.d.ts.map