import { BadRequestException } from '@nestjs/common';

export function maxImageBytes(): number {
  const configured = Number(process.env.MAX_FILE_SIZE);
  return Number.isSafeInteger(configured) && configured > 0 ? configured : 5 * 1024 * 1024;
}

export function validateImage(file: Express.Multer.File): void {
  if (!file || file.size <= 0) {
    throw new BadRequestException('A non-empty image is required');
  }
  if (file.size > maxImageBytes()) {
    throw new BadRequestException(`Image exceeds the maximum size of ${maxImageBytes() / 1024 / 1024} MB`);
  }
  if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
    throw new BadRequestException('Invalid file type. Only JPEG and PNG images are allowed');
  }
}
