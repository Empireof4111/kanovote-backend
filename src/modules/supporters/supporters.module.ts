import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from '@/entities/agent.entity';
import { Registration } from '@/entities/registration.entity';
import { Supporter } from '@/entities/supporter.entity';
import { SupporterService } from './supporters.service';
import { SupporterController } from './supporters.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Supporter, Agent, Registration])],
  providers: [SupporterService],
  controllers: [SupporterController],
  exports: [SupporterService],
})
export class SupporterModule {}
