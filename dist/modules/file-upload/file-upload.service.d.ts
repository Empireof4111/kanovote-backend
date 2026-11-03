import { Repository } from 'typeorm';
import { Agent } from '@/entities/agent.entity';
import { FileUpload, FileType } from '@/entities/file-upload.entity';
import { Supporter } from '@/entities/supporter.entity';
import { UserRole } from '@/entities/user-role.enum';
export type StoredImage = Pick<FileUpload, 'fileName' | 'filePath' | 'mimeType' | 'fileSize' | 'url'>;
export declare class FileUploadService {
    private fileUploadRepository;
    private supporterRepository;
    private agentRepository;
    constructor(fileUploadRepository: Repository<FileUpload>, supporterRepository: Repository<Supporter>, agentRepository: Repository<Agent>);
    uploadFile(file: Express.Multer.File, supporterId: string, uploadedByUserId: string, fileType: FileType): Promise<FileUpload>;
    uploadImageToStorage(file: Express.Multer.File, supporterId: string): Promise<StoredImage>;
    deleteStoredImage(publicId: string): Promise<void>;
    findById(id: string): Promise<FileUpload>;
    findBySupporterId(supporterId: string): Promise<FileUpload[]>;
    findBySupporterIdForRequester(supporterId: string, requester: {
        id: string;
        role: UserRole;
    }): Promise<FileUpload[]>;
    deleteFile(id: string): Promise<void>;
    getFileContent(id: string): Promise<string>;
    private syncSupporterDocumentState;
    private findSupervisorAgentByUserId;
    private assertSupervisorCanAccessSupporter;
}
//# sourceMappingURL=file-upload.service.d.ts.map