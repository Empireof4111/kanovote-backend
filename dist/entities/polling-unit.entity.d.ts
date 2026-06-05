import { Ward } from './ward.entity';
import { LocalGovernmentArea } from './lga.entity';
import { BaseUuidEntity } from './base-uuid.entity';
export declare class PollingUnit extends BaseUuidEntity {
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