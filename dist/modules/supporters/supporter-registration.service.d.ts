import { DataSource } from 'typeorm';
import { Supporter } from '@/entities/supporter.entity';
import { FileUploadService } from '../file-upload/file-upload.service';
import { CreateSupporterDto } from './dto';
import { SupporterService } from './supporters.service';
export type RegistrationImages = {
    passport?: Express.Multer.File[];
    voter_card?: Express.Multer.File[];
};
export declare class SupporterRegistrationService {
    private readonly dataSource;
    private readonly supporters;
    private readonly uploads;
    private readonly logger;
    constructor(dataSource: DataSource, supporters: SupporterService, uploads: FileUploadService);
    register(dto: CreateSupporterDto, userId: string, files: RegistrationImages): Promise<Supporter>;
}
//# sourceMappingURL=supporter-registration.service.d.ts.map