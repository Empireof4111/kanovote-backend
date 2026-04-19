import { SupporterService } from './supporters.service';
import { CreateSupporterDto, UpdateSupporterDto, VerifySupporterDto } from './dto';
export declare class SupporterController {
    private supporterService;
    constructor(supporterService: SupporterService);
    create(req: any, createSupporterDto: CreateSupporterDto): Promise<import("../../entities/supporter.entity").Supporter>;
    findAll(skip?: string, take?: string, state?: string, lga?: string, status?: string, search?: string): Promise<{
        supporters: any;
        total: any;
    }>;
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
    findById(id: string): Promise<import("../../entities/supporter.entity").Supporter>;
    update(id: string, updateSupporterDto: UpdateSupporterDto): Promise<import("../../entities/supporter.entity").Supporter>;
    verify(req: any, id: string, verifySupporterDto: VerifySupporterDto): Promise<import("../../entities/supporter.entity").Supporter>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=supporters.controller.d.ts.map