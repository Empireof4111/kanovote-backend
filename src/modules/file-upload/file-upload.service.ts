import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileUpload, FileType } from '@/entities/file-upload.entity';
import { Supporter } from '@/entities/supporter.entity';
import { v4 as uuid } from 'uuid';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class FileUploadService {
  constructor(
    @InjectRepository(FileUpload)
    private fileUploadRepository: Repository<FileUpload>,
    @InjectRepository(Supporter)
    private supporterRepository: Repository<Supporter>,
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

      await this.supporterRepository.update(supporterId, {
        documentUploaded: true,
        documentUrl: savedFile.url,
      });

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

    const activeFiles = await this.fileUploadRepository.count({
      where: { supporterId: file.supporterId, isActive: true },
    });

    if (activeFiles === 0) {
      await this.supporterRepository.update(file.supporterId, {
        documentUploaded: false,
        documentUrl: null,
      });
    }
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
}
