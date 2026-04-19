import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from '@/entities/agent.entity';
import { User } from '@/entities/user.entity';
import { AgentService } from './agents.service';
import { AgentController } from './agents.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Agent, User])],
  providers: [AgentService],
  controllers: [AgentController],
  exports: [AgentService],
})
export class AgentModule {}
