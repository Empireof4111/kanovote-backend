import { Repository } from 'typeorm';
import { Supporter } from '@/entities/supporter.entity';
import { Agent } from '@/entities/agent.entity';
import { Registration } from '@/entities/registration.entity';
export declare class ExportService {
    private supporterRepository;
    private agentRepository;
    private registrationRepository;
    constructor(supporterRepository: Repository<Supporter>, agentRepository: Repository<Agent>, registrationRepository: Repository<Registration>);
    exportSupportersCSV(filters?: {
        state?: string;
        lga?: string;
        status?: string;
    }): Promise<string>;
    exportAgentsCSV(filters?: {
        state?: string;
        lga?: string;
    }): Promise<string>;
    exportRegistrationsCSV(filters?: {
        agentId?: string;
        status?: string;
    }): Promise<string>;
}
//# sourceMappingURL=export.service.d.ts.map