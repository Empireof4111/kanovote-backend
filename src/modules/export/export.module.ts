import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supporter } from '@/entities/supporter.entity';
import { Agent } from '@/entities/agent.entity';
import { Registration } from '@/entities/registration.entity';
import { ExportService } from './export.service';
import { ExportController } from './export.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Supporter, Agent, Registration])],
  providers: [ExportService],
  controllers: [ExportController],
  exports: [ExportService],
})
export class ExportModule {}
