import { RegistrationService } from './registrations.service';
import { RegistrationStatus } from '@/entities/registration.entity';
export declare class RegistrationController {
    private registrationService;
    constructor(registrationService: RegistrationService);
    create({ agentId, supporterId }: {
        agentId: string;
        supporterId: string;
    }): Promise<import("@/entities/registration.entity").Registration>;
    getStatistics(): Promise<{
        total: any;
        initiated: any;
        inProgress: any;
        completed: any;
        verified: any;
        rejected: any;
    }>;
    findById(id: string): Promise<import("@/entities/registration.entity").Registration>;
    findByAgent(agentId: string, skip?: string, take?: string): Promise<{
        registrations: any;
        total: any;
    }>;
    findBySupporter(supporterId: string): Promise<any>;
    updateStatus(id: string, { status }: {
        status: RegistrationStatus;
    }): Promise<import("@/entities/registration.entity").Registration>;
}
//# sourceMappingURL=registrations.controller.d.ts.map