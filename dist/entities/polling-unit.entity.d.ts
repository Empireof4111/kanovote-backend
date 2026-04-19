import { Ward } from './ward.entity';
import { LocalGovernmentArea } from './lga.entity';
export declare class PollingUnit {
    id: string;
    wardId: string;
    lgaId: string;
    ward: Ward;
    lga: LocalGovernmentArea;
    name: string;
    code: string;
    address: string;
    registeredVoters: number;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=polling-unit.entity.d.ts.map