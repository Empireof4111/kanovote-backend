import { Ward } from './ward.entity';
import { BaseUuidEntity } from './base-uuid.entity';
export declare class LocalGovernmentArea extends BaseUuidEntity {
    name: string;
    code: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    wards: Ward[];
}
//# sourceMappingURL=lga.entity.d.ts.map