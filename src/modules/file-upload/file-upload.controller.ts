import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
  HttpCode,
  HttpStatus,
  Request,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@/entities/user-role.enum';
import { FileType } from '@/entities/file-upload.entity';
import { Response } from 'express';

@Controller('file-uploads')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FileUploadController {
  constructor(private fileUploadService: FileUploadService) {}

  @Post(':supporterId')
  @UseInterceptors(FileInterceptor('file'))
  @Roles(UserRole.SUPER_ADMIN, UserRole.FIELD_AGENT, UserRole.SUPERVISOR)
  @HttpCode(HttpStatus.CREATED)
  async uploadFile(
    @Request() req: any,
    @Param('supporterId') supporterId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() { fileType }: { fileType: FileType },
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!Object.values(FileType).includes(fileType)) {
      throw new BadRequestException('Invalid file type');
    }

    return this.fileUploadService.uploadFile(file, supporterId, req.user.id, fileType);
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SUPERVISOR)
  async getFile(@Param('id') id: string) {
    return this.fileUploadService.findById(id);
  }

  @Get(':id/download')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SUPERVISOR)
  async downloadFile(@Param('id') id: string, @Res() res: Response) {
    const file = await this.fileUploadService.findById(id);
    const url = await this.fileUploadService.getFileContent(id);

    res.redirect(url);
  }

  @Get('supporter/:supporterId')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SUPERVISOR)
  async getFiles(@Request() req: any, @Param('supporterId') supporterId: string) {
    return this.fileUploadService.findBySupporterIdForRequester(supporterId, req.user);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFile(@Param('id') id: string) {
    await this.fileUploadService.deleteFile(id);
  }
}
