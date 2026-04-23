import { FileUploadService } from './file-upload.service';
import { FileType } from '@/entities/file-upload.entity';
import { Response } from 'express';
export declare class FileUploadController {
    private fileUploadService;
    constructor(fileUploadService: FileUploadService);
    uploadFile(req: any, supporterId: string, file: Express.Multer.File, { fileType }: {
        fileType: FileType;
    }): Promise<import("@/entities/file-upload.entity").FileUpload>;
    getFile(id: string): Promise<import("@/entities/file-upload.entity").FileUpload>;
    downloadFile(id: string, res: Response): Promise<void>;
    getFiles(req: any, supporterId: string): Promise<import("@/entities/file-upload.entity").FileUpload[]>;
    deleteFile(id: string): Promise<void>;
}
//# sourceMappingURL=file-upload.controller.d.ts.map