import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from '@/entities/agent.entity';
import { Registration } from '@/entities/registration.entity';
import { Supporter } from '@/entities/supporter.entity';
import { SupporterService } from './supporters.service';
import { SupporterController } from './supporters.controller';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { SupporterRegistrationService } from './supporter-registration.service';

@Module({
  imports: [TypeOrmModule.forFeature([Supporter, Agent, Registration]), FileUploadModule],
  providers: [SupporterService, SupporterRegistrationService],
  controllers: [SupporterController],
  exports: [SupporterService],
})
export class SupporterModule {}
