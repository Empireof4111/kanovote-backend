import { Repository } from 'typeorm';
import { FileUpload, FileType } from '@/entities/file-upload.entity';
import { Supporter } from '@/entities/supporter.entity';
export declare class FileUploadService {
    private fileUploadRepository;
    private supporterRepository;
    constructor(fileUploadRepository: Repository<FileUpload>, supporterRepository: Repository<Supporter>);
    uploadFile(file: Express.Multer.File, supporterId: string, uploadedByUserId: string, fileType: FileType): Promise<FileUpload>;
    findById(id: string): Promise<FileUpload>;
    findBySupporterId(supporterId: string): Promise<FileUpload[]>;
    deleteFile(id: string): Promise<void>;
    getFileContent(id: string): Promise<string>;
}
//# sourceMappingURL=file-upload.service.d.ts.map