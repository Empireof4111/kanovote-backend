import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from '@/entities/agent.entity';
import { Supporter } from '@/entities/supporter.entity';
import { SupporterService } from './supporters.service';
import { SupporterController } from './supporters.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Supporter, Agent])],
  providers: [SupporterService],
  controllers: [SupporterController],
  exports: [SupporterService],
})
export class SupporterModule {}
