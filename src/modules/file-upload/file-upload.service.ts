import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileUpload, FileType } from '@/entities/file-upload.entity';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FileUploadService {
  private uploadDir = process.env.FILE_UPLOAD_DIR || './uploads';

  constructor(
    @InjectRepository(FileUpload)
    private fileUploadRepository: Repository<FileUpload>,
  ) {
    // Create upload directory if it doesn't exist
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
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
    const allowedMimes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only JPEG, PNG, and PDF are allowed');
    }

    try {
      // Save file to disk
      const fileName = `${uuid()}-${file.originalname}`;
      const filePath = path.join(this.uploadDir, fileName);
      fs.writeFileSync(filePath, file.buffer);

      // Create database record
      const fileUpload = this.fileUploadRepository.create({
        supporterId,
        uploadedByUserId,
        fileType,
        fileName: file.originalname,
        filePath,
        mimeType: file.mimetype,
        fileSize: file.size,
        url: `/uploads/${fileName}`,
      });

      return this.fileUploadRepository.save(fileUpload);
    } catch (error) {
      throw new BadRequestException('Failed to upload file');
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

    // Delete from disk
    if (fs.existsSync(file.filePath)) {
      fs.unlinkSync(file.filePath);
    }

    // Mark as inactive in database
    file.isActive = false;
    await this.fileUploadRepository.save(file);
  }

  async getFileContent(id: string): Promise<Buffer> {
    const file = await this.findById(id);

    if (!file.isActive) {
      throw new BadRequestException('File is no longer available');
    }

    if (!fs.existsSync(file.filePath)) {
      throw new NotFoundException('File not found on disk');
    }

    return fs.readFileSync(file.filePath);
  }
}
