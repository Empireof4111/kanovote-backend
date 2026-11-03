import { BadRequestException, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Agent, AgentStatus } from '@/entities/agent.entity';
import { FileType, FileUpload } from '@/entities/file-upload.entity';
import { Registration, RegistrationStatus } from '@/entities/registration.entity';
import { Supporter } from '@/entities/supporter.entity';
import { UserRole } from '@/entities/user-role.enum';
import { FileUploadService, StoredImage } from '../file-upload/file-upload.service';
import { validateImage } from '../file-upload/image-validation';
import { CreateSupporterDto } from './dto';
import { SupporterService } from './supporters.service';

export type RegistrationImages = {
  passport?: Express.Multer.File[];
  voter_card?: Express.Multer.File[];
};

@Injectable()
export class SupporterRegistrationService {
  private readonly logger = new Logger(SupporterRegistrationService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly supporters: SupporterService,
    private readonly uploads: FileUploadService,
  ) {}

  async register(dto: CreateSupporterDto, userId: string, files: RegistrationImages): Promise<Supporter> {
    const passport = files?.passport?.[0];
    const voterCard = files?.voter_card?.[0];
    if (!passport || !voterCard) {
      throw new BadRequestException('Both passport photo and voter card image are required');
    }
    // Validate both before creating any row or uploading either file.
    validateImage(passport);
    validateImage(voterCard);

    const uploaded: StoredImage[] = [];
    try {
      return await this.dataSource.transaction(async (manager) => {
        const agent = await manager.getRepository(Agent).findOne({
          where: { userId, role: UserRole.FIELD_AGENT, status: AgentStatus.ACTIVE },
        });
        if (!agent) throw new ForbiddenException('An active field-agent profile is required');

        const supporter = await this.supporters.create(dto, userId, manager.getRepository(Supporter));
        uploaded.push(await this.uploads.uploadImageToStorage(passport, supporter.id));
        uploaded.push(await this.uploads.uploadImageToStorage(voterCard, supporter.id));

        const fileRepository = manager.getRepository(FileUpload);
        await fileRepository.save(uploaded.map((image, index) => fileRepository.create({
          ...image,
          supporterId: supporter.id,
          uploadedByUserId: userId,
          fileType: index === 0 ? FileType.PASSPORT : FileType.VOTER_CARD,
        })));

        supporter.documentUploaded = true;
        supporter.documentUrl = uploaded[0].url;
        await manager.getRepository(Supporter).save(supporter);

        const registrationRepository = manager.getRepository(Registration);
        await registrationRepository.save(registrationRepository.create({
          agentId: agent.id,
          supporterId: supporter.id,
          status: RegistrationStatus.COMPLETED,
          completionPercentage: 100,
          completedAt: new Date(),
        }));
        return supporter;
      });
    } catch (error) {
      // A failed upload or database write rolls back all member rows. Remove any
      // images already stored, without hiding the original error if cleanup fails.
      const cleanup = await Promise.allSettled(uploaded.map((image) => this.uploads.deleteStoredImage(image.filePath)));
      cleanup.forEach((result, index) => {
        if (result.status === 'rejected') {
          this.logger.error(`Could not remove abandoned registration image ${uploaded[index].filePath}`);
        }
      });
      throw error;
    }
  }
}
