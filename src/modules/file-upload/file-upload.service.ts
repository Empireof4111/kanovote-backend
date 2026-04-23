import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from '@/entities/agent.entity';
import { FileUpload, FileType } from '@/entities/file-upload.entity';
import { Supporter } from '@/entities/supporter.entity';
import { UserRole } from '@/entities/user-role.enum';
import { v4 as uuid } from 'uuid';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class FileUploadService {
  constructor(
    @InjectRepository(FileUpload)
    private fileUploadRepository: Repository<FileUpload>,
    @InjectRepository(Supporter)
    private supporterRepository: Repository<Supporter>,
    @InjectRepository(Agent)
    private agentRepository: Repository<Agent>,
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    supporterId: string,
    uploadedByUserId: string,
    fileType: FileType,
  ): Promise<FileUpload> {
    // Validate file
    const maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '5242880') || 5242880; // 5MB default
    if (file.size > maxFileSize) {
      throw new BadRequestException(`File size exceeds maximum limit of ${maxFileSize / 1024 / 1024}MB`);
    }

    // Validate file type
    const allowedMimes = ['image/jpeg', 'image/png'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only JPEG and PNG images are allowed');
    }

    try {
      if (
        !process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET
      ) {
        throw new BadRequestException('Cloudinary is not configured');
      }

      const publicId = `${process.env.CLOUDINARY_FOLDER || 'kanovote'}/${supporterId}/${uuid()}-${file.originalname}`;
      const uploadResult = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            public_id: publicId,
            resource_type: 'image',
            overwrite: false,
          },
          (error, result) => {
            if (error || !result) {
              reject(error || new Error('Upload failed'));
              return;
            }

            resolve(result);
          },
        );

        uploadStream.end(file.buffer);
      });

      // Create database record
      const fileUpload = this.fileUploadRepository.create({
        supporterId,
        uploadedByUserId,
        fileType,
        fileName: file.originalname,
        filePath: uploadResult.public_id,
        mimeType: file.mimetype,
        fileSize: file.size,
        url: uploadResult.secure_url,
      });

      const savedFile = await this.fileUploadRepository.save(fileUpload);

      await this.syncSupporterDocumentState(supporterId);

      return savedFile;
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to upload file',
      );
    }
  }

  async findById(id: string): Promise<FileUpload> {
    const file = await this.fileUploadRepository.findOne({ where: { id } });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file;
  }

  async findBySupporterId(supporterId: string): Promise<FileUpload[]> {
    return this.fileUploadRepository.find({
      where: { supporterId, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findBySupporterIdForRequester(
    supporterId: string,
    requester: { id: string; role: UserRole },
  ): Promise<FileUpload[]> {
    if (requester.role === UserRole.SUPERVISOR) {
      await this.assertSupervisorCanAccessSupporter(requester.id, supporterId);
    }

    return this.findBySupporterId(supporterId);
  }

  async deleteFile(id: string): Promise<void> {
    const file = await this.findById(id);

    if (file.filePath) {
      await cloudinary.uploader.destroy(file.filePath, {
        resource_type: 'image',
      });
    }

    // Mark as inactive in database
    file.isActive = false;
    await this.fileUploadRepository.save(file);

    await this.syncSupporterDocumentState(file.supporterId);
  }

  async getFileContent(id: string): Promise<string> {
    const file = await this.findById(id);

    if (!file.isActive) {
      throw new BadRequestException('File is no longer available');
    }

    if (!file.url) {
      throw new NotFoundException('File URL not found');
    }

    return file.url;
  }

  private async syncSupporterDocumentState(supporterId: string): Promise<void> {
    const activeFiles = await this.fileUploadRepository.find({
      where: { supporterId, isActive: true },
      order: { createdAt: 'DESC' },
    });

    const passportFile = activeFiles.find((file) => file.fileType === FileType.PASSPORT);
    const primaryImage = passportFile || activeFiles[0] || null;

    await this.supporterRepository.update(supporterId, {
      documentUploaded: activeFiles.length > 0,
      documentUrl: primaryImage?.url || null,
    });
  }

  private async findSupervisorAgentByUserId(userId: string): Promise<Agent> {
    const supervisorAgent = await this.agentRepository.findOne({
      where: { userId, role: UserRole.SUPERVISOR },
    });

    if (!supervisorAgent) {
      throw new ForbiddenException('Supervisor profile not found');
    }

    return supervisorAgent;
  }

  private async assertSupervisorCanAccessSupporter(supervisorUserId: string, supporterId: string): Promise<void> {
    const supervisorAgent = await this.findSupervisorAgentByUserId(supervisorUserId);

    const scopedSupporter = await this.supporterRepository
      .createQueryBuilder('supporter')
      .innerJoin(Agent, 'registeredAgent', 'registeredAgent.userId = supporter.registeredByUserId')
      .where('supporter.id = :supporterId', { supporterId })
      .andWhere('registeredAgent.role = :fieldAgentRole', { fieldAgentRole: UserRole.FIELD_AGENT })
      .andWhere('registeredAgent.lga = :supervisorLga', { supervisorLga: supervisorAgent.lga })
      .getOne();

    if (!scopedSupporter) {
      throw new ForbiddenException(
        'You can only access supporter files registered by field agents in your local government area',
      );
    }
  }
}
