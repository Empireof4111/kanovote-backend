import { LocalGovernmentArea } from './lga.entity';
import { PollingUnit } from './polling-unit.entity';
export declare class Ward {
    id: string;
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