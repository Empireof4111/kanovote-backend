import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/entities/user.entity';
import { Agent } from '@/entities/agent.entity';
import { LocalGovernmentArea } from '@/entities/lga.entity';
import { Ward } from '@/entities/ward.entity';
import { PollingUnit } from '@/entities/polling-unit.entity';
import { Supporter } from '@/entities/supporter.entity';
import { Registration } from '@/entities/registration.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Agent,
      LocalGovernmentArea,
      Ward,
      PollingUnit,
      Supporter,
      Registration,
    ]),
  ],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
