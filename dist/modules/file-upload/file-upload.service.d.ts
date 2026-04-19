import { Repository } from 'typeorm';
import { FileUpload, FileType } from '@/entities/file-upload.entity';
export declare class FileUploadService {
    private fileUploadRepository;
    private uploadDir;
    constructor(fileUploadRepository: Repository<FileUpload>);
    uploadFile(file: Express.Multer.File, supporterId: string, uploadedByUserId: string, fileType: FileType): Promise<FileUpload>;
    findById(id: string): Promise<FileUpload>;
    findBySupporterId(supporterId: string): Promise<FileUpload[]>;
    deleteFile(id: string): Promise<void>;
    getFileContent(id: string): Promise<Buffer>;
}
//# sourceMappingURL=file-upload.service.d.ts.map