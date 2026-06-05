import { LocalGovernmentArea } from './lga.entity';
import { PollingUnit } from './polling-unit.entity';
import { BaseUuidEntity } from './base-uuid.entity';
export declare class Ward extends BaseUuidEntity {
    lgaId: string;
    lga: LocalGovernmentArea;
    name: string;
    code: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    pollingUnits: PollingUnit[];
}
//# sourceMappingURL=ward.entity.d.ts.map