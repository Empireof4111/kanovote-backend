import { SupporterService } from './supporters.service';
import { CreateSupporterDto, UpdateSupporterDto, VerifySupporterDto } from './dto';
import { RegistrationImages, SupporterRegistrationService } from './supporter-registration.service';
export declare class SupporterController {
    private supporterService;
    private registrationService;
    constructor(supporterService: SupporterService, registrationService: SupporterRegistrationService);
    registerWithImages(req: any, dto: CreateSupporterDto, files: RegistrationImages): Promise<import("../../entities/supporter.entity").Supporter>;
    create(req: any, createSupporterDto: CreateSupporterDto): Promise<import("../../entities/supporter.entity").Supporter>;
    findAll(req: any, skip?: string, take?: string, state?: string, lga?: string, status?: string, search?: string): Promise<{
        supporters: import("../../entities/supporter.entity").Supporter[];
        total: number;
    }>;
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
    findById(req: any, id: string): Promise<import("../../entities/supporter.entity").Supporter>;
    update(id: string, updateSupporterDto: UpdateSupporterDto): Promise<import("../../entities/supporter.entity").Supporter>;
    verify(req: any, id: string, verifySupporterDto: VerifySupporterDto): Promise<import("../../entities/supporter.entity").Supporter>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=supporters.controller.d.ts.map